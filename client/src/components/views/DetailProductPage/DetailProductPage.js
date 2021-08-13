import React, { useEffect, useState } from "react";
import axios from "axios";
import Tabs from "./Sections/Tabs";
import { Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../_actions/user_actions";
import Ratio from 'react-ratio';
import styled from 'styled-components';
import { Button } from "antd";
import Swal from 'sweetalert2';
import './css/DetailPage.css'

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
    dispatch(addToCart(props.detail._id));
    Swal.fire(
      'Success!',
      '카트에 상품이 추가되었습니다.',
      'success'
    )
  };

  return (
    <div id="body" style={{ width: "100%", padding: "3rem 4rem" }}>
      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* ProductVideo */}
          <DetailTemplate>
          <Ratio ratio={ 16 / 9 }>
          <video
            style={{backgroundColor: "black", borderRadius: '12px'}}
            src={`${Product.filePath}`}
            controls
            controlsList="nodownload"
          />
          </Ratio>
        </DetailTemplate>
        <div style={{ display: "flex", justifyContent: "flex-start", paddingTop: '20px'}}>
        <h1>{Product.title}</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
        
      </div>
      </div>
      {/* <div id="tags">
      <span><a href={`/hashtag/${Product.tags}`}>#{Product.tags}</a></span>
      </div> */}
      <div id="info">
        <span id="price">가격: {Product.price}</span>
        <span id="sold">sold: {Product.sold}</span>
        <span id="view">view: {Product.views}</span>
      </div>
      <Button class="addtocart" size="large" shape="round" onClick={clickHandler}>
          여행 목록에 담기
        </Button>
        <Button class="addtocart" size="large" shape="round" onClick={clickHandler}>
          Add to Cart
        </Button>
      </Col>
        {/* <Col lg={12} sm={24}> */}
          {/* ProductInfo */}
          {/* <ProductInfo detail={Product} /> */}
        {/* </Col> */}
        <Col lg={12} sm={24}>
          <Tabs detail={Product}/>
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
