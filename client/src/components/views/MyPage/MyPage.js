import React, { useEffect, useState } from "react";
import Tabs from "./Sections/Tabs";
import { Avatar, Form, Input } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
const { TextArea } = Input;

function MyPage(props) {
  const user = useSelector((state) => state.user);

  console.log(user.userData);

  return (
    <div id="body">
      <Tabs detail={user} />
    </div>
  );
}

export default MyPage;
