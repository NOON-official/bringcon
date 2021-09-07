import React, { useState } from "react";
import { Input } from "antd";
import "../css/SearchBar.css";

const { Search } = Input;
const Genres = [
  { key: 1, value: "전체" },
  { key: 2, value: "Emotions" },
  { key: 3, value: "Foods and Drinks" },
  { key: 4, value: "Animals" },
  { key: 5, value: "Gaming" },
  { key: 6, value: "Animations" },
  { key: 7, value: "Sports" },
];

function SearchFeature(props) {
  const [SearchTerm, setSearchTerm] = useState("");
  const [Genre, setGenre] = useState(1);

  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    if( window.location.pathname === "/contents" || event.key === 'Enter') {
      props.refreshFunction(event.currentTarget.value);
    }
  };

  const genreChangeHandler = (event) => {
    setGenre(event.currentTarget.value);
  };

  return (
    <div className="search-wrapper">
      <select
        onChange={genreChangeHandler}
        value={Genre}
        className="dropdown-filter"
      >
        {Genres.map((item) => (
          <option key={item.key} value={item.key}>
            {" "}
            {item.value}
          </option>
        ))}
      </select>
      <Search
        placeholder="브링콘과 함께 콘텐츠 여행을 떠나보세요!"
        // onFocus="this.placeholder = ''"
        onChange={searchHandler}
        onKeyPress={searchHandler}
        style={{ width: 720, height: "40px", borderRadius: "200px" }}
        value={SearchTerm}
      />
    </div>
  );
}

export default SearchFeature;
