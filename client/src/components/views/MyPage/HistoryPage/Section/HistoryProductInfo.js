import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "antd";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../../_actions/user_actions";
import { withRouter } from "react-router-dom";

function HistoryProductInfo(props) {
  const dispatch = useDispatch();
  const [CheckedList, setCheckedList] = useState(props.order.ProductInfo);
  const [checkAll, setCheckAll] = useState(true);
  const crypto = require("crypto");

  console.log("props.order.ProducrInfo", props.order.ProductInfo);
  useEffect(() => {
    setCheckAll(CheckedList.length === props.order.ProductInfo.length);
  }, [CheckedList]);

  useEffect(() => {
    setCheckedList(props.order.ProductInfo);
  }, [props.order.ProductInfo]);

  const clickHandler = (productId) => {
    //필요한 정보를 Cart 필드에다가 넣어 준다.
    dispatch(addToCart(productId)).then((response) => {
      //로그인하지 않는 사용자 로그인하게 하기.

      if (response.payload.success == false) {
        Swal.fire({
          title: "Fails",
          text: response.payload.message,
          imageUrl:
            "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d5604f65-07b8-427a-8a3c-8ee5ef0dc5b0/pop-up3.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210831%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210831T023013Z&X-Amz-Expires=86400&X-Amz-Signature=4c72f76745dc6f27ed587421dfa5a6d2eb023d8d6869f9455ccad93d3824f035&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22pop-up3.svg%22",
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          showCancelButton: true,
          confirmButtonText: "목록 보기",
          cancelButtonText: "계속 탐색하기",
          background:
            "#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210830T044712Z&X-Amz-Expires=86400&X-Amz-Signature=6664bf9459c6e1d4115105918d83a1312ecb9ac22d9e751bc8c2b4b63321ee20&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)",
        }).then((result) => {
          if (result.isConfirmed) {
            props.history.push("/user/cart");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      } else if (response.payload.isAuth == false) {
        Swal.fire({
          title: "Fails",
          text: "로그인해야 카트에 담을 수 있습니다.",
          imageUrl:
            "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d5604f65-07b8-427a-8a3c-8ee5ef0dc5b0/pop-up3.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210831%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210831T023013Z&X-Amz-Expires=86400&X-Amz-Signature=4c72f76745dc6f27ed587421dfa5a6d2eb023d8d6869f9455ccad93d3824f035&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22pop-up3.svg%22",
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          confirmButtonText: "로그인하기",
          background:
            "#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210830T044712Z&X-Amz-Expires=86400&X-Amz-Signature=6664bf9459c6e1d4115105918d83a1312ecb9ac22d9e751bc8c2b4b63321ee20&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)",
        }).then((result) => {
          if (result.isConfirmed) {
            props.history.push("/login");
          }
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "우주 여행지 목록을 추가하였습니다. 여행 목록을 점검하러 가시겠어요?",
          imageUrl:
            "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d5604f65-07b8-427a-8a3c-8ee5ef0dc5b0/pop-up3.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210831%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210831T023013Z&X-Amz-Expires=86400&X-Amz-Signature=4c72f76745dc6f27ed587421dfa5a6d2eb023d8d6869f9455ccad93d3824f035&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22pop-up3.svg%22",
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          showCancelButton: true,
          confirmButtonText: "목록 보기",
          cancelButtonText: "계속 탐색하기",
          background:
            "#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210830T044712Z&X-Amz-Expires=86400&X-Amz-Signature=6664bf9459c6e1d4115105918d83a1312ecb9ac22d9e751bc8c2b4b63321ee20&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)",
        }).then((result) => {
          if (result.isConfirmed) {
            props.history.push("/user/cart");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      }
    });
  };

  const handleDownloadClick = (product) => {
    const body = {
      product_id: product.id,
      userId: props.userId,
      orderInfo: props.order.OrderInfo,
    };

    if (product.download >= 1) {
      return Swal.fire(
        "다운로드는 1회만 가능합니다. 다시 다운로드하고 싶다면 관리자에게 문의하세요."
      );
    }
    //다운로드 할 product id를 백엔드로 보내줌
    axios.post("/api/product/download", body).then((response) => {
      if (response.data.success) {
        window.location.href = response.data.url;
        Swal.fire("파일이 다운로드되었습니다.");
      } else {
        Swal.fire("다운로드에 실패하였습니다. :( ");
      }
    });
  };

  const handleDownloadClickSeleted = (CheckedList) => {
    CheckedList.map((product, index) => {
      if (product.download >= 1) {
        Swal.fire("다운로드는 1회만 가능합니다.");
      } else {
        const body = {
          product_id: product.id,
          userId: props.userId,
          orderInfo: props.order.OrderInfo,
        };
        //다운로드 할 product id를 백엔드로 보내줌
        axios.post("/api/product/download", body).then((response) => {
          if (response.data.success) {
            window.location.href = response.data.url;
          } else {
            Swal.fire("다운로드에 실패하였습니다. :( ");
          }
        });
      }
    });
  };

  const onChange = (e, id) => {
    e.stopPropagation();
    // 체크할 시 CheckList에 id값 넣기
    if (e.target.checked) {
      setCheckedList([...CheckedList, e.target.value]);
      // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
    } else {
      setCheckedList(CheckedList.filter((checkedId) => checkedId !== id));
    }
  };

  console.log("CheckedList", CheckedList);
  console.log("checkAll", checkAll);

  const onCheckAllChange = (e) => {
    e.stopPropagation();
    setCheckedList(e.target.checked ? props.order.ProductInfo : []);
    setCheckAll(e.target.checked);
  };

  return (
    <div className="close">
      {/* 주문 건당 상품 리스트 */}
      <tr className="checkall-info">
        <th className="history-checkall" colSpan="4">
          <Checkbox
            style={{ marginRight: "5px" }}
            onChange={(e) => onCheckAllChange(e)}
            checked={checkAll}
          />
          전체 선택
        </th>
        <th className="download">
          <button
            style={{ float: "right" }}
            className="download-button"
            onClick={(e) => {
              e.preventDefault();
              handleDownloadClickSeleted(CheckedList);
            }}
          >
            선택 다운로드
          </button>
        </th>
      </tr>
      {props.order.ProductInfo.map((product, index) => (
        <table key={index}>
          <tbody>
            <tr className="purchased-row" style={{ height: "120px" }}>
              <td
                style={{
                  borderBottom: "none",
                  borderRadius: "12px",
                }}
              >
                <Checkbox
                  value={product}
                  onChange={(e) => onChange(e, product)}
                  checked={CheckedList.indexOf(product) >= 0 ? true : false}
                />
              </td>

              <td style={{ width: "200px" }}>
                {/* 썸네일 이미지 */}
                <img
                  style={{
                    width: "142px",
                    height: "80px",
                    borderRadius: "8px",
                  }}
                  alt="product"
                  src={product.s3thumbnail}
                />
              </td>

              <td style={{ width: "300px" }}>
                {/* 상품 이름, 올린 사람 */}
                <div className="purchased-title">{product.title}</div>
                <div className="purchased-uploader">{product.writer}</div>
              </td>
              {/* 저작권 코드 */}
              <td>
                {crypto
                  .createHash("md5")
                  .update(
                    product.id +
                      props.userId +
                      props.order.OrderInfo.dateOfPurchase
                  )
                  .digest("base64")}
              </td>
              <td style={{ width: "200px" }}>
                {/* 상품 가격 */}
                <div className="purchased-price">{product.price}원</div>
              </td>
              <td style={{ borderRadius: "12px" }}>
                {/* 다운로드, 재구매 버튼 */}
                <button
                  className="single-download-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownloadClick(product);
                  }}
                >
                  다운로드
                </button>
                <br />
                <button
                  className="rebuy-button"
                  onClick={(e) => {
                    e.preventDefault();
                    clickHandler(product.id);
                  }}
                >
                  재구매
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}

export default withRouter(HistoryProductInfo);
