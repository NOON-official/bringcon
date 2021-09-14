import React, { useEffect, useState } from "react";
import axios from "axios";
import Tabs from "./Sections/Tabs";
import { Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../_actions/user_actions";
import Ratio from "react-ratio";
import styled from "styled-components";
import Swal from "sweetalert2";
import "./css/DetailPage.css";
import mobile from '../Main/mobile.png';
import Success from '../../utils/Success.svg';
import Error from '../../utils/Error.svg';

function DetailProductPage(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.productId;
  const [Product, setProduct] = useState({});

  const DetailTemplate = styled.div`
    video {
      width: 100%;
      height: 100%;
    }
  `;

  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        setProduct(response.data[0]);
      })
      .catch((err) => alert(err));
  }, [productId]);

  const clickHandler = () => {
    //필요한 정보를 Cart 필드에다가 넣어 준다.
    dispatch(addToCart(productId)).then((response) => {
      //로그인하지 않는 사용자 로그인하게 하기.

      if (response.payload.success == false) {
        Swal.fire({
          title: "Oops...!",
          text: response.payload.message,
          imageUrl:
          Error,
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          showCancelButton: true,
          confirmButtonText: "목록 보기",
          cancelButtonText: "계속 탐색하기",
          background:
            "#fff url(../Main/background.svg)",
        }).then((result) => {
          if (result.isConfirmed) {
            props.history.push("/user/cart");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      } else if (response.payload.isAuth == false) {
        Swal.fire({
          title: "Login?",
          text: "로그인해야 카트에 담을 수 있습니다.",
          imageUrl: Error,
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          confirmButtonText: "로그인하기",
          background:
            "#fff url(../Main/background.svg)",
        }).then((result) => {
          if (result.isConfirmed) {
            props.history.push("/login");
          }
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "우주 여행지 목록을 추가하였습니다. 여행 목록을 점검하러 가시겠어요?",
          imageUrl: Success,
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          showCancelButton: true,
          confirmButtonText: "목록 보기",
          cancelButtonText: "계속 탐색하기",
          background:
            "#fff url(../Main/background.svg)",
        }).then((result) => {
          if (result.isConfirmed) {
            props.history.push("/user/cart");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      }
    });
  };

  return (
    <div>
    <div id="small-body">
        <img src={mobile} className="mobile"/>
    </div>
    <div id="body" style={{ width: "100%", padding: "3rem 4rem" }}>
      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* ProductVideo */}
          <DetailTemplate>
            <Ratio ratio={16 / 9}>
              {Product.wmFilePath ? (
                <video
                  style={{ backgroundColor: "black", borderRadius: "12px" }}
                  src={`${Product.wmFilePath}`}
                  controls
                  controlsList="nodownload"
                />
              ) : (
                // DB 파일 최종 정리 후 삭제할 부분
                <video
                  style={{ backgroundColor: "black", borderRadius: "12px" }}
                  src={`${Product.filePath}`}
                  controls
                  controlsList="nodownload"
                />
              )}
            </Ratio>
          </DetailTemplate>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              paddingTop: "20px",
            }}
          >
            <h1>{Product.title}</h1>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
          </div>
          {/* <div id="tags">
      <span><a href={`/hashtag/${Product.tags}`}>#{Product.tags}</a></span>
      </div> */}
          <div id="info">
            <span id="price">가격: {Product.price}</span>
            <span id="sold">sold: {Product.sold}</span>
            <span id="view">view: {Product.views}</span>
          </div>

          <button className="cart-button" onClick={clickHandler}>
            여행 목록에 담기
          </button>
        </Col>
        {/* <Col lg={12} sm={24}> */}
        {/* ProductInfo */}
        {/* <ProductInfo detail={Product} /> */}
        {/* </Col> */}
        <Col lg={12} sm={24}>
          <Tabs detail={Product} />
        </Col>
      </Row>
    </div>
    </div>
  );
}

export default DetailProductPage;
