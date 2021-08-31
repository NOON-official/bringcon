import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Icon, Col, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import { useSelector } from "react-redux";
import Checkbox from "./Sections/CheckBox";
import Radiobox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";
import { genres, price } from "./Sections/Datas";
import ScrollHorizontal from "react-scroll-horizontal";
import "./css/LandingPage.css";
import HorizontalScroll from "react-scroll-horizontal";
import uniqueRandomArray from "unique-random-array";

const Categories = [
  { key: 0, value: "전체" },
  { key: 1, value: "Clips" },
  { key: 2, value: "Memes" },
];

const Standards = [
  { key: "views", value: "인기순" },
  { key: "_id", value: "최신순" },
];

function UserVideoPage(props) {
  const userId = props.match.params.userId;
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Standard, setStandard] = useState("views");
  const [Category, setCategory] = useState(1);
  const [Filters, setFilters] = useState({
    genres: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");
  const [WriterName, setWriterName] = useState("");
  const user = useSelector((state) => state.user);
  //처음 실행시 getProducts 작동!
  useEffect(() => {
    let body = {
      skip: Skip,
      sortBy: Standard,
    };
    getProducts(body);
  }, [Standard]);

  //새롭게 아이템들을 가져와줌
  const getProducts = (body) => {
    axios
      .post(`/api/product/products_by_userId?userId=${userId}`, body)
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.productInfo);
          setWriterName(response.data.productInfo[0].writer.name);
        } else {
          alert(" 상품을 가져오는데 실패했습니다.");
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
  
  const Interests =
    user.userData && user.userData.interests
      ? user.userData.interests
      : [
          "test_tag1",
          "test_tag2",
          "test_tag3",
          "test_tag4",
          "test_tag5",
          "test_tag6",
          "test_tag7",
        ];

  const renderInterests = () =>
    Interests.map((interest, index) => {
      return (
        <a href={`/hashtag/${interest}`} target="_blank" key={index}>
          <span id="hash">{interest}</span>
        </a>
      );
    });
  const random = uniqueRandomArray(Interests);
  const renderRandomInterests = () =>
    [random(), random(), random(), random()].map((interests, index) => {
      return (
        <a href={`/hashtag/${interests}`} target="_blank" key={index}>
          <span id="hash">{interests}</span>
        </a>
      );
    });

  const renderCards = Products.map((product, index) => {
    return (
      <div key={index} className="tile">
        <div
          id="card-video"
          style={{ backgroundImage: `url(${product.s3thumbnail})` }}
        >
          <a href={`/product/${product._id}`} target="_blank">
            <video
              src={`${product.filePath}`}
              onMouseOver={handleMouseover}
              onMouseOut={handleMouseout}
              muted
            />
          </a>
        </div>
        <div id="card-avatar">
          <Meta
            avatar={
              <a href={`/videos/${product.writer._id}`} target="_blank">
                <Avatar src={product.writer.image} />
              </a>
            }
            title={product.title}
          />
          <a href={`/videos/${product.writer._id}`} target="_blank">
            <span>{product.writer.name}</span>
          </a>
          <span id="card-price">{`${product.price.toLocaleString(
            "ko-KR"
          )} 원`}</span>
          <br />
        </div>
      </div>
    );
  });

  //장르 변화 줄때도 getProducts 작동!
  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
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
      skip: 0, //DB에서 처음 상품부터 가져와야 함
      filters: Filters, //현재 genres와 price에 적용된 필터 그대로 적용 + 검색어
      searchTerm: newSearchTerm,
    };

    setSkip(0);

    //자식 컴포넌트인 SearchFeature에서 전달해준 값으로 업데이트됨
    setSearchTerm(newSearchTerm);
    getProducts(body); //백엔드에 보내서 처리!
  };

  const CategoryChangeHandler = (event) => {
    setCategory(event.currentTarget.value);
  };

  const standardChangeHandler = (event) => {
    setStandard(event.currentTarget.value);
  };

  return (
    <div
      id="filters"
      style={{ width: "100%", paddingTop: "1em", borderTop: "#1C1C1C" }}
    >
      {/* Filter */}
      {/* <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
      {/* <Checkbox list={genres} handleFilters={filters => handleFilters(filters, "genres")} />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
      {/* <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col> */}
      {/* </Row> */}

      {/* Search */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "1em",
          margin: "1em auto",
          backgroundColor: "#1C1C1C",
        }}
      >
        <SearchFeature
          placeholder={`${WriterName}님의 콘텐츠를 탐험해보세요!`}
          refreshFunction={updateSearchTerm}
        />
        <br />
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1em auto",
            backgroundColor: "#1C1C1C",
          }}
        >
          {/* 선호 태그 */}
          {Interests.length > 5 ? renderRandomInterests() : renderInterests()}
        </div>
        <div
          id="drops"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1em auto",
            backgroundColor: "#1C1C1C",
          }}
        >
          <select
            onChange={CategoryChangeHandler}
            value={Category}
            className="landing-category-dropdown"
          >
            {Categories.map((item) => (
              <option key={item.key} value={item.key}>
                {" "}
                {item.value}
              </option>
            ))}
          </select>
          <select
            onChange={standardChangeHandler}
            value={Standard}
            className="landing-sort-dropdown"
          >
            {Standards.map((item) => (
              <option key={item.key} value={item.key}>
                {item.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards */}
      {renderCards.length <= 10 ? (
        <div id="scroll-horizontal-fixed" style={{ height: `43em` }}>
          <HorizontalScroll>{renderCards}</HorizontalScroll>
        </div>
      ) : (
        <div id="scroll-horizontal" style={{ height: `43em` }}>
          <HorizontalScroll>{renderCards}</HorizontalScroll>
        </div>
      )}
    </div>
  );
}

export default UserVideoPage;
