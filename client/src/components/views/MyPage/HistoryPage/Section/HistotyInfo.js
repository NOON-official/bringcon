import React, { useState } from "react";
import HistoryProductInfo from "./HistoryProductInfo";
import { Col } from "antd";

const getDateOfPurchase = (dateOfPurchase) => {
  let date = new Date(dateOfPurchase);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  date = `${year}.${month}.${day}`;

  return date;
};

const handleToggle = (e) => {
  console.log(e.target.id);

  if (e.target.id === "purchase-info") {
    let element = e.currentTarget.children[0];
    let _element = element.children[1];

    if (_element.classList.contains("block")) {
      _element.classList.remove("block");
      element.children[0].children[0].innerHTML = "▶&nbsp;&nbsp;&nbsp;&nbsp;";
    } else {
      _element.classList.add("block");
      element.children[0].children[0].innerHTML = "▼&nbsp;&nbsp;&nbsp;&nbsp;";
    }
  } else {
    console.log("not toggle part");

    return false;
  }
};

function HistoryInfo(props) {
  return (
    <Col style={{ float: "right", width: "1150px" }}>
      <div className="history-container">
        <div className="mypage-bloc-tabs">
          <button className={"mypage-tabs active-tabs"}>구매 내역</button>
          {/* <HistorySearchFeature/> */}
        </div>
        <div className="purchased-list">
          <table style={{ width: "900px", margin: "auto", marginTop: "41px" }}>
            {/* 주문 건당 토글바 */}
            {props.user.userData &&
              props.user.userData.history &&
              props.user.userData.history.map((order, index) => (
                <tbody key={index} style={{ width: "900px", margin: "auto" }}>
                  <tr
                    className="toggle-box"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle(e);
                    }}
                  >
                    <td colSpan="5">
                      <div className="purchase-info" id={"purchase-info"}>
                        {/* 결제 일시 */}
                        <span
                          style={{ float: "left", paddingLeft: "15px" }}
                          id={"purchase-info"}
                        >
                          ▶&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                        <span id={"purchase-info"}>{`${getDateOfPurchase(
                          order.OrderInfo.dateOfPurchase
                        )}`}</span>

                        {/* 결제 수단 */}
                        <span
                          style={{ paddingLeft: "90px" }}
                          id={"purchase-info"}
                        >
                          {(() => {
                            // 카카오페이, 페이코 등으로 결제한 경우 (간편 결제)
                            if (order.OrderInfo.embPgProvider) {
                              return `간편결제 (${order.OrderInfo.embPgProvider})`;
                            } else {
                              switch (order.OrderInfo.payMethod) {
                                case "card":
                                  return `카드결제 (${order.OrderInfo.cardName} ${order.OrderInfo.cardNumber})`;

                                case "trans":
                                  return "실시간계좌이체";

                                case "phone":
                                  return "휴대폰결제";

                                default:
                                  return "결제완료";
                              }
                            }
                          })()}
                        </span>

                        {/* 결제 총금액 */}
                        <span
                          style={{ float: "right", paddingRight: "15px" }}
                          id={"purchase-info"}
                        >{`${order.OrderInfo.amount.toLocaleString(
                          "ko-KR"
                        )}원`}</span>
                      </div>
                      <HistoryProductInfo order={order} />
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
      </div>
    </Col>
  );
}

export default HistoryInfo;
