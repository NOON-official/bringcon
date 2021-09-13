import React, { useEffect, useState } from "react";
import axios from "axios";
import Tabs from "./Sections/Tabs";
import { Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../_actions/user_actions";
import Ratio from "react-ratio";
import styled from "styled-components";
import { Button } from "antd";
import Swal from "sweetalert2";
import "./css/DetailPage.css";

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
      if (response.payload.success == false) {
        Swal.fire({
          title: "False",
          text: "우주 여행지 목록은 하나씩만 추가가능합니다. 여행 목록을 점검하러 가시겠어요?",
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

  return (
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
  );
}

export default DetailProductPage;
