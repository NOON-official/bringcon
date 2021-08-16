import React, { useState } from "react";
import { Input } from "antd";
import "../css/SearchBar.css";
import CheckBox from "./CheckBox";

const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerm, setSearchTerm] = useState("");

  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value);
    props.refreshFunction(event.currentTarget.value);
  };

  return (
    <div>
      <Search
        placeholder="관리자 전용 페이지입니다.!"
        onfocus="this.placeholder = ''"
        onblur="this.placeholder = 'enter your text'"
        onChange={searchHandler}
        style={{ width: 720, height: "40px", borderRadius: "200px" }}
        value={SearchTerm}
      />
    </div>
  );
}

export default SearchFeature;
