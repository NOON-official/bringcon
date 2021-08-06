import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Icon, Col, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import Checkbox from "./Sections/CheckBox";
import Radiobox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";
import { genres, price } from "./Sections/Datas";

function HashTagPage(props) {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    genres: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");
  const Tag = props.match.params.tag;

  //처음 실행시 getProducts 작동!
  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  //새롭게 아이템들을 가져와줌
  const getProducts = (body) => {
    axios
      .post(`/api/product/products_by_hashtag?tag=${Tag}`, body)
      .then((response) => {
        if (response.data.success) {
          if (body.loadMore) {
            setProducts([...Products, ...response.data.productInfo]);
          } else {
            setProducts(response.data.productInfo);
          }
          setPostSize(response.data.postSize);
        } else {
          alert(" 상품들을 가져오는데 실패 했습니다.");
        }
      });
  };

  // 더보기 눌렀을 때 getProducts 작동!
  const loadMoreHanlder = () => {
    let skip = Skip + Limit;
    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
      filters: Filters,
    };

    getProducts(body);
    setSkip(skip);
  };

  function handleMouseover(e) {
    e.currentTarget.play();
  }

  function handleMouseout(e) {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  }

  const renderCards = Products.map((product, index) => {
    // var minutes = Math.floor(product.duration / 60);
    // var seconds = Math.floor(product.duration - minutes * 60);

    return (
      <Col lg={6} md={12} xs={24}>
        <div
          style={{
            overflow: "hidden",
            backgroundColor: "black",
            width: "100%",
            height: "0px",
            paddingTop: "56.25%",
            position: "relative",
          }}
        >
          <a href={`/product/${product._id}`}>
            <video
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "0",
              }}
              src={`${product.filePath}`}
              onMouseOver={handleMouseover}
              onMouseOut={handleMouseout}
              muted
            />
            {/* <div className="duration">
                    <span>{minutes} : {seconds}</span>
                </div> */}
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={product.writer.image} />}
          title={product.title}
        />
        <span>{product.writer.name}</span>
        <span
          style={{
            marginRight: "10px",
            fontWeight: "500",
            float: "right",
            display: "inline-block",
            textAlign: "right",
          }}
        >{`${product.price.toLocaleString("ko-KR")} ₩`}</span>
        <br />
      </Col>
    );
  });

  //장르 변화 줄때도 getProducts 작동!
  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };

    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    console.log("filters", filters);

    if (category === "price") {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }
    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  //search할 때 getProducts 작동!
  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0, //DB에서 처음부터 긁어와줘야 됨
      limit: Limit, //8
      filters: Filters, //현재 genres와 price에 적용된 필터 그대로 적용 + 검색어
      searchTerm: newSearchTerm,
    };

    setSkip(0);

    //자식 컴포넌트인 SearchFeature에서 전달해준 값으로 업데이트됨
    setSearchTerm(newSearchTerm);

    getProducts(body); //백엔드에 보내서 처리!
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          {" "}
          #{Tag} pages <Icon type="bulb" />{" "}
        </h2>
      </div>

      {/* Filter */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <Checkbox
            list={genres}
            handleFilters={(filters) => handleFilters(filters, "genres")}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <Radiobox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>

      {/* Cards */}

      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />

      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHanlder}>더보기</button>
        </div>
      )}
    </div>
  );
}

export default HashTagPage;
