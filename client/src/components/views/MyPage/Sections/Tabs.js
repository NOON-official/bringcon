import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Avatar, Icon, Col, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import { Descriptions } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Tabs.css";

function Tabs(props) {
  console.log(props.detail.userData);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          기본 정보
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          취향
        </button>
      </div>
      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <h1>my page!</h1>
          <h2>프로필 이미지</h2>
          <Avatar
            src={props.detail.userData && props.detail.userData.image}
            size="large"
          ></Avatar>

          <h2>name : {props.detail.userData && props.detail.userData.name}</h2>

          <h2>
            계좌 번호 :
            {props.detail.userData && props.detail.userData.accountNumber}
          </h2>
          <h2>
            예금주 :
            {props.detail.userData && props.detail.userData.accountHolder}
          </h2>
          <h2>은행 : {props.detail.userData && props.detail.userData.bank}</h2>
        </div>
      </div>
      <div
        className={toggleState === 2 ? "content  active-content" : "content"}
      ></div>
    </div>
  );
}

export default Tabs;
