import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar } from "antd";
import Meta from "antd/lib/card/Meta";
import SearchFeature from "./Sections/SearchFeature";
import { price } from "./Sections/Datas";
import "./css/LandingPage.css";
import HorizontalScroll from "react-scroll-horizontal";
import uniqueRandomArray from "unique-random-array";

const Genres = [
  { key: 0, value: "All" },
  { key: 1, value: "Animals" },
  { key: 2, value: "Animations" },
  { key: 3, value: "Arts" },
  { key: 4, value: "Broadcasting" },
  { key: 5, value: "Business" },
  { key: 6, value: "Cartoon" },
  { key: 7, value: "Character" },
  { key: 8, value: "Land-marks" },
  { key: 9, value: "Music" },
  { key: 10, value: "Nature" },
  { key: 11, value: "Sports" },
  { key: 12, value: "Etc" }
];

const Standards = [
  { key: "views", value: "인기순" },
  { key: "_id", value: "최신순" },
];

function HashTagPage(props) {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Standard, setStandard] = useState("views");
  const [Genre, setGenre] = useState(0);
  const [Filters, setFilters] = useState({
    genres: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");
  const Tag = props.match.params.tag;
  const user = useSelector((state) => state.user);
  
  //처음 실행시 getProducts 작동!
  useEffect(() => {
    if(Genre == 0) { // All
      // 필터 초기화
      setFilters({ genres: [], price: [] })
      
      let body = {
        skip: Skip,
        sortBy: Standard,
        filters: {
          genres: [],
          price: [],
        }
      };

      if( props && props.location && props.location.search ){
        //console.log(props.location.search);
        body.searchTerm = props.location.search.split('=')[1];
      }

      getProducts(body);
    } else { // 장르 선택한 경우
      handleFilters(Genre, "genres")
    }
  }, [Standard, Genre]);

  //새롭게 아이템들을 가져와줌
  const getProducts = (body) => {
    axios.post(`/api/product/products_by_hashtag?tag=${Tag}`, body).then((response) => {
      if (response.data.success) {
        setProducts(response.data.productInfo);
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
      : ["동물", "클립영상", "유머", "일상"];

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
          <a
            href={`/videos/${product.writer._id}`}
            target="_blank"
            style={{ color: "#fff" }}
          >
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
      sortBy: Standard,
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
      //기존에 들어와있던 장르 초기화
      const newFilters = {
        genres: [],
        price: [],
      }

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
      sortBy: Standard,
    };

    setSkip(0);

    //자식 컴포넌트인 SearchFeature에서 전달해준 값으로 업데이트됨
    setSearchTerm(newSearchTerm);
    getProducts(body); //백엔드에 보내서 처리!
  };

  const GenreChangeHandler = (event) => {
    setGenre(event.currentTarget.value);
  };

  const standardChangeHandler = (event) => {
    setStandard(event.currentTarget.value);
  };

  return (
    <div
      id="body"
      style={{ width: "100%", paddingTop: "1em", borderTop: "#1C1C1C" }}
    >
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
          placeholder={`#${Tag}`}
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
          {/* 장르 선택 */}
          <select
            onChange={GenreChangeHandler}
            value={Genre}
            className="landing-category-dropdown"
          >
            {Genres.map((item) => (
              <option key={item.key} value={item.key}>
                {" "}
                {item.value}
              </option>
            ))}
          </select>
          
          {/* 기준 선택 */}
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
          <HorizontalScroll reverseScroll={true}>{renderCards}</HorizontalScroll>
        </div>
      ) : (
        <div id="scroll-horizontal" style={{ height: `43em` }}>
          <HorizontalScroll reverseScroll={true}>{renderCards}</HorizontalScroll>
        </div>
      )}
    </div>
  );
}

export default HashTagPage;
