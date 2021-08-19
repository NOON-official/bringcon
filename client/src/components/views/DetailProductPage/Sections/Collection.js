import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/UserVideo.css';

function Collection(props) {
  console.log(props)
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
          alert("상품들을 가져오는데 실패 했습니다.");
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
            width: "70%",
            height: "100%",
            position: "relative",
          }}
        >
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
          <div className="uservideo-info" style={{color: '#ffcb39'}}>
            <h2>{product.title}</h2>
            <span className="info">조회: {product.views}, 판매: {product.sold}</span>
        </div>
        </div>
        
      </div>
    );
  });

  return (
    <div>
    

      <div style={{ width: "100%%", margin: "3rem auto" }}>
     

        {/* Cards */}

        <div>{renderCards}</div>


        <br />

      </div>
    </div>
  );
}

export default Collection;
