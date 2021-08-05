import React, { useEffect, useState } from "react";
import { Typography, Button, Form, Input, Icon } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
const { TextArea } = Input;

function MyPage(props) {
  const [Phone, setPhone] = useState("");
  const [Account, setAccount] = useState("numbers");

  const AccountChangeHandler = (event) => {
    setAccount(event.currentTarget.value);
  };

  return (
    <div>
      <h1>my page!</h1>
      <h2>프로필 이미지</h2>
      <img src={props.user.userData && props.user.userData.image}></img>
      <h2>name : {props.user.userData && props.user.userData.name}</h2>
      <a href="/user/history">
        <h2>history link</h2>
      </a>
      <a href="/user/cart">
        <h2>cart link</h2>
      </a>
      <a href="">
        <h2>my videos link</h2>
      </a>
      <h2>
        계좌 번호 :{props.user.userData && props.user.userData.accountNumber}
      </h2>
      <h2>
        예금주 :{props.user.userData && props.user.userData.accountHolder}
      </h2>
    </div>
  );
}

export default MyPage;
