const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const ffmpeg = require("fluent-ffmpeg");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

// const awsLoadPath = path.join(__dirname, "/../config/s3.json");
// aws.config.loadFromPath(awsLoadPath);

// let s3 = new aws.S3();

// let upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: "bringcon-bucket",
//       key: function (req, file, cb) {
//         cb(null, `${Date.now()}_${file.originalname}`);
//       },
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       acl: "public-read-write",
//     }),
//   });

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only mp4 is allowd"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  //라우터 변경 필요
  //비디오를 서버에 저장
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";

  //비디오 duration 가져오기
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    // console.dir(metadata) //all metadata
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.filePath) //썸네일 파일 이름 생성
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      console.log("filenames: ", filenames);

      //배열로 수정
      filePath = filenames.map((x) => "uploads/thumbnails/" + x);
      // filePath = 'uploads/thumbnails/' + filenames[0]
      console.log("filePath: ", filePath);
    })
    .on("end", function () {
      //썸네일 생성 끝난 후
      console.log("Screenshots taken");
      return res.json({
        success: true,
        filePath: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      //에러 발생 시
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      //옵션
      // Will take screenshots at 20%, 40%, 60% and 80% of the video
      count: 3, //썸네일 3개
      folder: "uploads/thumbnails",
      size: "320x240",
      // size: '1920x1080', //유튜브 동영상 크기
      //'%b': input basename (filename without extension)
      filename: "thumbnail-%b.png",
    });
});

//현재 submit안하고 dropzone에 넣기만해도 로컬에 저장됨, 라우트 수정 필요
router.post("/", (req, res) => {
  //받아온 정보들을 DB에 넣어 준다.
  const product = new Product(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//데이터에 filter 처리를 한 후 알맞은 데이터를 프론트로 보내줌
router.post("/products", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  // product collection에 들어 있는 모든 상품 정보를 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm; //서치바에서 검색한 단어 ex) 'mexico'

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    //검색어가 있으면
    if (term.startsWith("#")) {
      //해쉬태그 검색하는 경우
      term = term.substring(1); //'#' 제거

      Product.find(findArgs)
        .find({ tags: term })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    } else {
      //문자열 검색
      Product.find(findArgs)

        //find 조건 추가, 몽고디비에서 제공하는 $text, $search 이용
        //Product 컬렉션 안에 있는 데이터 중 term과 일치하는 자료 가져옴
        .find({ $text: { $search: term } })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    }
  } else {
    //검색어가 없으면, 원래대로 프로세스 수행
    Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

//id=123123123,324234234,324234234  type=array
router.get("/products_by_id", (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === "array") {
    //id=123123123,324234234,324234234 이거를
    //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

router.post("/products_by_hashtag", (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  // product collection에 들어 있는 모든 상품 정보를 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm; //서치바에서 검색한 단어 ex) 'mexico'
  let tag = req.query.tag;
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    //검색어가 있으면
    if (term.startsWith("#")) {
      //해쉬태그 검색하는 경우
      term = term.substring(1); //'#' 제거

      Product.find(findArgs)
        .find({ tags: tag })
        .find({ tags: term })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    } else {
      //문자열 검색
      Product.find(findArgs)
        .find({ tags: tag })

        //find 조건 추가, 몽고디비에서 제공하는 $text, $search 이용
        //Product 컬렉션 안에 있는 데이터 중 term과 일치하는 자료 가져옴
        .find({ $text: { $search: term } })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({
            success: true,
            productInfo,
            postSize: productInfo.length,
          });
        });
    }
  } else {
    //검색어가 없으면, 원래대로 프로세스 수행
    Product.find(findArgs)
      .find({ tags: tag })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        });
      });
  }
});

module.exports = router;
