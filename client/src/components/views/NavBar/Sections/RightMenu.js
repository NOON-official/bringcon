/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Icon, Badge } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./Navbar.css"
// import GoogleLogin from "../../LoginPage/LoginPage";

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        Swal.fire("Oops...", "로그인에 실패했습니다.", "error");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode} style={{ backgroundColor: "#1C1C1C" }}>
        <Menu.Item key="mail">
          <button>
            <a href="/login">Login</a>
          </button>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode} style={{ backgroundColor: "#1C1C1C" }}>
        {/* 랜딩페이지 */}
        <Menu.Item key="contents">
          <a href="/" style={{ color: "#ffcb39" }}>
            Contents
          </a>
        </Menu.Item>

        {/* 마이페이지 */}
        <Menu.Item key="mypage">
          <a href="/user/history" style={{ color: "#ffcb39" }}>
            My Page
          </a>
        </Menu.Item>

        {/* 장바구니 */}
        <Menu.Item id="cart" key="cart">
          <Badge 
            count={user.userData && user.userData.cart.length}
            style={{ zIndex: 1,  }}
          >
            <a href="/user/cart" style={{ color: "#ffcb39" }}>
              Cart
            </a>
          </Badge>
        </Menu.Item>

        {/* 로그아웃 */}
        <Menu.Item key="logout">
          <a onClick={logoutHandler} style={{ color: "#ffcb39" }}>
            Logout
          </a>
        </Menu.Item>

        {/* 업로드 페이지 */}
        <Menu.Item key="upload">
        <button className="upload-button">
          <a className="upload-button-text" href="/product/upload">
            Upload
          </a>
        </button>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
