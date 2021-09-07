import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Checkbox } from "antd";

const handleDownloadClick = (item) => {
  const data = { product_id: item };
  //다운로드 할 product id를 백엔드로 보내줌
  axios.post("/api/product/download", data).then((response) => {
    if (response.data.success) {
      window.location.href = response.data.url;
      alert("파일이 다운로드되었습니다.");
    } else {
      alert("다운로드에 실패하였습니다.");
    }
  });
};

const handleDownloadClickSeleted = (CheckedList) => {
  CheckedList.map((product, index) => {
    const data = { product_id: product.id };
    //다운로드 할 product id를 백엔드로 보내줌
    axios.post("/api/product/download", data).then((response) => {
      if (response.data.success) {
        window.location.href = response.data.url;
      } else {
        alert("다운로드에 실패하였습니다.");
      }
    });
  });
};

function HistoryProductInfo(props) {
  const [CheckedList, setCheckedList] = useState(props.order.ProductInfo);
  const [checkAll, setCheckAll] = useState(true);

  useEffect(() => {
    setCheckAll(CheckedList.length === props.order.ProductInfo.length);
  }, [CheckedList]);

  useEffect(() => {
    setCheckedList(props.order.ProductInfo);
  }, [props.order.ProductInfo]);

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
                    handleDownloadClick(product.id);
                  }}
                >
                  다운로드
                </button>
                <br />
                <button className="rebuy-button">재구매</button>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}

export default HistoryProductInfo;
