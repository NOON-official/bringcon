import React, { useEffect, useState } from "react";
import { Avatar, Form, Input } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
const { TextArea } = Input;

function MyPage(props) {
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(user.userData && user.userData.image);
  const [Name, setName] = useState(user.userData && user.userData.name);
  console.log(profile);
  console.log(user.userData && user.userData.image);
  return (
    <div>
      <h1>my page!</h1>
      <h2>프로필 이미지</h2>
      <Avatar src={profile}></Avatar>

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
