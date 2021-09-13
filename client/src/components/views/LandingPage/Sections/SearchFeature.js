import React, { useState } from "react";
import { Input } from "antd";
import "../css/SearchBar.css";

const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerm, setSearchTerm] = useState("");

  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    if( window.location.pathname === "/contents" || 
        window.location.pathname.includes("/hashtag") || 
        window.location.pathname.includes("/videos") || 
        event.key === 'Enter') {
      props.refreshFunction(event.currentTarget.value);
    }
  };

  return (
    <div>
      <Search
        placeholder={props.placeholder ? props.placeholder : "브링콘과 함께 콘텐츠 여행을 떠나보세요!"}
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