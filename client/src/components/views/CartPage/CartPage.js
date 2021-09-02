import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy,
} from "../../../_actions/user_actions";
import { Empty, Result, Col } from "antd";
import Payment from "../../utils/Payment";
import "./Sections/CartPage.css";
import { configConsumerProps } from "antd/lib/config-provider";
import "./Sections/UserCardBlock.css";
import { Checkbox } from "antd";

function CartPage(props) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);
  const [PG, setPG] = useState("html5_inicis");
  const [PayMethod, setPayMethod] = useState("card");
  const [CheckedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(true);

  const onChange = (e, id) => {
    // 체크할 시 CheckList에 id값 넣기
    if (e.target.checked) {
      setCheckedList([...CheckedList, e.target.value]);
      // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
    } else {
      setCheckedList(CheckedList.filter((checkedId) => checkedId !== id));
    }
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? props.user.cartDetail : []);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    let cartItems = [];
    //리덕스 User state안에 cart 안에 상품이 들어있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length >= 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });
        dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
          (response) => {
            setCheckedList(response.payload);
          }
        );
        setShowTotal(true);
      }
    }
  }, [props.user.userData, dispatch]);

  useEffect(() => {
    calculateTotal(CheckedList);
    setCheckAll(
      CheckedList.length ===
        (props.user.cartDetail && props.user.cartDetail.length)
    );
  }, [CheckedList]);

  let calculateTotal = (CheckedList) => {
    let total = 0;
    CheckedList.map((item) => {
      total += parseInt(item.price, 10) * item.quantity;
    });
    setTotal(total);
  };

  let removeFromCart = (productId) => {
    //개별로 삭제할 때
    dispatch(removeCartItem(productId)).then((response) => {
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  let removeFromCartSeleted = (CheckedList) => {
    //선택 삭제할 때
    CheckedList.map((product, index) => {
      dispatch(removeCartItem(product._id)).then((response) => {
        if (response.payload.productInfo.length <= 0) {
          setShowTotal(false);
        }
      });
    });
  };

  const transactionSuccess = (data) => {
    //자식컴포넌트인 Payment에서 data값을 받아옴
    //onSuccessBuy라는 action 발생시킴!
    dispatch(
      onSuccessBuy({
        paymentData: data, //결제 성공시 Payment에서 전달해준 정보를 백엔드로 전달해줌
        cartDetail: CheckedList, //리덕스 스토어 안에 있는 CartDetail 정보 전달해줌
      })
    ).then((response) => {
      //백엔드에서 처리 끝나면
      if (response.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
    });
  };

  //라디오버튼 옵션 변경
  const handleOptionChange = (changeEvent) => {
    setPayMethod(changeEvent.target.value);
  };

  const renderItems = () =>
    props.user.cartDetail &&
    props.user.cartDetail.map((product, index) => (
      <tr key={index} className="rendered-card">
        <td>
          <Checkbox
            value={product}
            onChange={(e) => onChange(e, product)}
            checked={CheckedList.indexOf(product) >= 0 ? true : false}
          />
        </td>
        <td style={{ width: "200px" }}>
          <img
            style={{ width: "142px", height: "80px" }}
            alt="product"
            className="cart-image"
            src={product.s3thumbnail}
          />
        </td>
        <td style={{ width: "300px", marginLeft: "26px" }} colSpan="2">
          <div className="cart-title">{product.title}</div>
          <br />
          <div className="cart-seller">
            <span>{product.writer.name}</span>

            <span className="cart-price">{product.price}원</span>
          </div>
        </td>
        <td>
          <span>{product.quantity}개</span>
          <button
            style={{ float: "right" }}
            className="single-remove-button"
            onClick={() => removeFromCart(product._id)}
          >
            삭제
          </button>
        </td>
      </tr>
    ));

  return (
    <div
      id="body"
      style={{
        width: "auto",
        height: "100vh",
        backgroundColor: "#1C1C1C",
        margin: "auto",
      }}
    >
      <div
        className="my-cart"
        style={{
          width: "1092px",
          margin: "auto",
          marginBottom: "16px",
          paddingTop: "50px",
        }}
      >
        장바구니
      </div>
      <div
        className="cart-page"
        style={{
          width: "1092px",
          height: "411px",
          overflow: "auto",
          margin: "auto",
        }}
      >
        {ShowTotal ? (
          <div>
            <table style={{ marginLeft: "63px", width: "1000px" }}>
              <tbody>
                <td className="remove-info" colSpan="4">
                  <div className="check-all-text" style={{ width: "100px" }}>
                    <Checkbox
                      onChange={onCheckAllChange}
                      checked={checkAll}
                      style={{ marginRight: "4px" }}
                    />
                    전체 선택
                  </div>
                </td>
                <td className="remove-info">
                  <button
                    style={{ float: "right" }}
                    className="single-remove-button"
                    onClick={() => removeFromCartSeleted(CheckedList)}
                  >
                    선택 삭제
                  </button>
                </td>
                {renderItems()}
              </tbody>
            </table>
          </div>
        ) : ShowSuccess ? (
          // 결제 성공하면 화면에 메시지 보여줌
          <Result status="success" title="Successfully Purchased Items" />
        ) : (
          // 카트에 상품이 없는 경우
          <>
            <br />
            <Empty description={false} />
          </>
        )}
      </div>

      {/* ShowTotal이 있을 때만 총 금액과 결제 버튼을 보여줌
                즉 카트에 상품이 없으면 총 금액과 결제 버튼도 안보임 */}
      {ShowTotal && (
        <div
          style={{ width: "1092px", marginLeft: "218px", marginBottom: "16px" }}
        >
          <Col style={{ width: "500px", float: "left" }}>
            <div
              className="total-price"
              style={{ width: "378px", marginBottom: "16px" }}
            >
              <h2 className="number-price">
                총{CheckedList ? CheckedList.length : 0}
                개의 상품 {Total}원
              </h2>
            </div>
          </Col>
          <Col>
            <form className="pay-form" style={{ float: "right" }}>
              <div className="form-check">
                <label>
                  <input
                    type="radio"
                    name="react-tips"
                    value="card"
                    checked={PayMethod === "card"}
                    onChange={handleOptionChange}
                    className="form-check-input"
                  />
                  <div className="pay-box">카드</div>
                </label>
                <label>
                  <input
                    type="radio"
                    name="react-tips"
                    value="trans"
                    checked={PayMethod === "trans"}
                    onChange={handleOptionChange}
                    className="form-check-input"
                  />
                  <div className="pay-box">실시간 계좌이체</div>
                </label>
                <label>
                  <input
                    type="radio"
                    name="react-tips"
                    value="phone"
                    checked={PayMethod === "phone"}
                    onChange={handleOptionChange}
                    className="form-check-input"
                  />
                  <div className="pay-box">모바일 결제</div>
                </label>
              </div>

              <div className="form-group">
                <Payment
                  pg={PG}
                  payMethod={PayMethod}
                  total={Total}
                  userData={props.user.userData}
                  onSuccess={transactionSuccess}
                  history={props.history}
                />
              </div>
            </form>
          </Col>
        </div>
      )}
    </div>
  );
}

export default CartPage;
