import React, {useState} from "react";
import { Menu, Icon, Badge } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Error from '../../../utils/Error.svg';
import "./Navbar.css"
import $ from 'jquery'

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const [Selected, setSelected] = useState([])

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        
        Swal.fire("Oops...", "로그인에 실패했습니다.", "error");
      }
    });
  };
  
  // 선택된 메뉴 bold 처리
  $(".ant-menu-item a").each(
    function() {
      // 마이페이지 - 프로필 외 다른 탭에 있는 경우
      if((window.location.pathname === "/user/history" ||
          window.location.pathname === "/user/mycontents" ||
          window.location.pathname === "/user/review" ||
          window.location.pathname === "/user/info" ||
          window.location.pathname === "/user/account" ||
          window.location.pathname === "/user/review/update") && Selected.length === 0) {
            setSelected(["mypage"])
      } else if(window.location.href === this.href && Selected.length === 0) { // 현재 위치에 해당하는 NavBar key 설정하기   
        setSelected([this.selected])
      }
    }
  );

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu selectedKeys={Selected} mode={props.mode} style={{ backgroundColor: "#1C1C1C" }}>
        <Menu.Item key="login">
          <button className="right-button" style={{marginTop: '8px'}}>
            <a selected="login" href="/login" className="right-button-text">Sign In</a>
          </button>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu selectedKeys={Selected} mode={props.mode} style={{ backgroundColor: "#1C1C1C" }}>
        {/* 마이페이지 */}
        <Menu.Item key="mypage">
          <a selected="mypage" href="/user/profile" style={{ color: "#ffcb39" }}>
            My Page
          </a>
        </Menu.Item>

        {/* 장바구니 */}
        <Menu.Item id="cart" key="cart">
          <Badge 
            count={user.userData && user.userData.cart.length}
            style={{ zIndex: 1,  }}
          >
            <a selected="cart" href="/user/cart" style={{ color: "#ffcb39" }}>
              Cart
            </a>
          </Badge>
        </Menu.Item>

        {/* 로그아웃 */}
        <Menu.Item key="logout">
          <a selected="logout" onClick={logoutHandler} style={{ color: "#ffcb39" }}>
            Sign Out
          </a>
        </Menu.Item>

        {/* 업로드 페이지 */}
        <Menu.Item key="upload">
        <button className="right-button">
          <a selected="upload" className="right-button-text" href="/product/upload">
            Upload
          </a>
        </button>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
