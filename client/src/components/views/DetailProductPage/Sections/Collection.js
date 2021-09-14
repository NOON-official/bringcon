import React, { useEffect, useState } from "react";
import axios from "axios";
import {Col} from 'antd';
import '../css/UserVideo.css';
import Swal from 'sweetalert2';
import Error from '../../../utils/Error.svg';

function Collection(props) {
  const [UserId, setUserId] = useState("");
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);

  if(props.writer !== undefined && UserId===""){
    setUserId(props.writer._id)
  }

  // UserId 가져온 후 getProducts 작동!
  useEffect(() => {
    if(UserId !== ""){
      let body = {
        skip: Skip,
      };
      getProducts(body);
    }
  }, [UserId]);

  //새롭게 아이템들을 가져와줌
  const getProducts = (body) => {
    axios
      .post(`/api/product/products_by_userId?userId=${UserId}`, body)
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.productInfo);
        } else {
          Swal.fire({
            title: 'Oops...!',
            text: '상품들을 가져오는 데 실패했습니다.',
            imageUrl: Error,
            imageWidth: 200,
            imageHeight: 176,
            imageAlt: 'Custom Image',
            background: '#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210901%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210901T051556Z&X-Amz-Expires=86400&X-Amz-Signature=e0cd25d9c0ca96f3cfa764e2a894db9f8f1b216d68f762ea97bedc9149d5abf6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)',
          })
        }
      });
  };

  function handleMouseover(e) {
    e.currentTarget.play();
  }

  function handleMouseout(e) {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  }

  const renderCards = Products.map((product, index) => {
    return (
      <div className="uservideo-container">
        <div className="description-box"
          style={{
            overflow: "hidden",
            // width: "70%",
            height: "100%",
            position: "relative",
          }}
        >
          <Col style={{float: 'left', width: '200px', height: '200px'}}>
          <a href={`/product/${product._id}`}>
            <video
              style={{
                backgroundImage: `url(${product.s3thumbnail})`,
                background: 'linearGradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) )',
                width: "192px",
                height: "108px",
                position: "absolute",
                top: "0",
                left: "0",
              }}
              src={`${product.filePath}`}
              onMouseOver={handleMouseover}
              onMouseOut={handleMouseout}
              muted
            />
          </a>
          </Col>
          <Col style={{float:'left'}}>
          <div className="uservideo-info" style={{color: '#ffcb39'}}>
            <h2>{product.title}</h2>
            <span className="info">조회: {product.views}, 판매: {product.sold}</span>
        </div>
        </Col>
        </div>
        
      </div>
    );
  });

  return (
    <div>
      <div style={{ width: "100%%", margin: "3rem auto" }}>
        {/* Cards */}
      <div>
        {renderCards}
      </div>
      <br />
      </div>
    </div>
  );
}

export default Collection;
