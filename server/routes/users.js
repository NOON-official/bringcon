const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Order } = require("../models/Order");

const { auth } = require("../middleware/auth");
const async = require("async");
const { default: axios } = require("axios");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie("w_authExp", user.tokenExp);
      res.cookie("w_auth", user.token).status(200).json({
        loginSuccess: true,
        userId: user._id,
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post("/addToCart", auth, (req, res) => {
  //먼저  User Collection에 해당 유저의 정보를 가져오기
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인

    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });

    //상품이 이미 있을때
    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, "cart.id": req.body.productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(200).json({ success: false, err });
          res.status(200).send(userInfo.cart);
        }
      );
    }
    //상품이 이미 있지 않을때
    else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).send(userInfo.cart);
        }
      );
    }
  });
});

router.get("/removeFromCart", auth, (req, res) => {
  //먼저 cart안에 내가 지우려고 한 상품을 지워주기
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { cart: { id: req.query.id } },
    },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map((item) => {
        return item.id;
      });

      //product collection에서  현재 남아있는 상품들의 정보를 가져오기

      //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1cb3e30de4'] 이런식으로 바꿔주기
      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, productInfo) => {
          return res.status(200).json({
            productInfo,
            cart,
          });
        });
    }
  );
});

router.post("/order", (req, res) => {
  const order = new Order(req.body);

  order.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true,
      merchantId: order._id,
      orderName: order.orderName,
      pg: order.pg,
      payMethod: order.payMethod,
      amount: order.amount,
      buyerTel: order.buyerTel,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
    });
  });
});

router.post("/successBuy", auth, (req, res) => {
  //결제 성공후

  //1. User Collection 안에  History 필드 안에  간단한 결제 정보 넣어주기
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      impUid: req.body.paymentData.imp_uid,
      merchantUid: req.body.paymentData.merchant_uid,
    });
  });

  transactionData.product = history;

  //history 정보 저장
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } }, //카트 비워줌
    { new: true }, //업데이트 후 새로운 document 가져올 수 있도록
    (err, user) => {
      if (err) return res.json({ success: false, err });

      //payment에다가  transactionData정보 저장
      Order.findOneAndUpdate(
        { _id: req.body.paymentData.merchant_uid },
        { $push: { product: transactionData.product } },
        { new: true },
        (err, doc) => {
          if (err) return res.json({ success: false, err });

          //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기
          //상품 당 몇개의 quantity를 샀는지

          let products = [];
          doc.product.forEach((item) => {
            products.push({ id: item.id, quantity: item.quantity });
          });

          //async를 이용해 for문 없이 깔끔한 코드 가능!
          async.eachSeries(
            products,
            (item, callback) => {
              Product.updateOne(
                { _id: item.id },
                {
                  $inc: {
                    sold: item.quantity,
                  },
                },
                { new: false }, //다시 사용할 일 없음
                callback
              );
            },
            (err) => {
              if (err) return res.status(400).json({ success: false, err });
              res.status(200).json({
                success: true,
                cart: user.cart,
                cartDetail: [],
              });
            }
          );
        }
      );
    }
  );
});

router.post("/account", (req, res) => {
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        accountHolder: req.body.accountHolder,
        accountNumber: req.body.accountNumber,
        bank: req.body.Bank,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json({
        success: true,
      });
    }
  );
});

module.exports = router;
