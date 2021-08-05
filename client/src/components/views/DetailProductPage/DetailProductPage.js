import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductInfo from "./Sections/ProductInfo";
import { Row, Col } from "antd";
import Ratio from 'react-ratio';
import styled from 'styled-components';

function DetailProductPage(props) {
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

  return (
    <div style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* ProductVideo */}
          <DetailTemplate>
          <Ratio ratio={ 16 / 9 }>
          <video
            style={{backgroundColor: "black"}}
            src={`${Product.filePath}`}
            controls
            controlsList="nodownload"
          />
          </Ratio>
        </DetailTemplate>
        </Col>
        <Col lg={12} sm={24}>
          {/* ProductInfo */}
          <ProductInfo detail={Product} />
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
