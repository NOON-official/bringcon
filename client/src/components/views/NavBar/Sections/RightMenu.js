/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Icon, Badge } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
// import GoogleLogin from "../../LoginPage/LoginPage";

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode} style={{backgroundColor: "#1C1C1C"}}>
        <Menu.Item key="mail">
        <button><a href="/login">Login</a></button>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode} style={{backgroundColor: "#1C1C1C"}}>
        {/* 회사 및 서비스 소개 페이지 만들기 */}
        <Menu.Item key="about">
          <a href="#" style={{color: "#ffcb39"}}>About</a>
        </Menu.Item>

        <Menu.Item key="history">
          <a href="/user/history" style={{color: "#ffcb39"}}>History</a>
        </Menu.Item>

        <Menu.Item key="upload">
          <a href="/product/upload" style={{color: "#ffcb39"}}>Upload</a>
        </Menu.Item>

        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <Badge count={user.userData && user.userData.cart.length} style={{zIndex: 10}}>
            <a
              href="/user/cart"
              className="head-example"
              style={{ marginRight: -22, color: "#667777"}}
            >
              <Icon
                type="shopping-cart"
                style={{ fontSize: 30, marginBottom: 3 }}
              />
            </a>
          </Badge>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler} style={{color: "#ffcb39"}}>Log out</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
