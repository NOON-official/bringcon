import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import $ from 'jquery';
import './Badge.css';
const SubMenu = Menu.SubMenu;

function LeftMenu(props) {
  const user = useSelector((state) => state.user);
  const [Selected, setSelected] = useState([])

  // 선택된 메뉴 bold 처리
  $(".ant-menu-item a").each(
    function() {
      // 현재 위치에 해당하는 NavBar key 설정하기   
      if(window.location.href === this.href && Selected.length === 0) {
        setSelected([this.selected])
      }
    }
  );

  return (
    <Menu selectedKeys={Selected} mode={props.mode} style={{ backgroundColor: "#1C1C1C" }}>
      {/* 어바웃 페이지 */}
      <Menu.Item key="about">
        <a selected="about" href="/about" style={{ color: "#ffcb39" }}>
          About
        </a>
      </Menu.Item>

      {/* 공지사항 */}
      <Menu.Item key="notice">
        <a selected="notice" href="/board" style={{ color: "#ffcb39" }}>
          Notice
        </a>
      </Menu.Item>

      {/* 컨텐츠 페이지 */}
      <Menu.Item key="contents">
        <a selected="contents" href="/contents" style={{ color: "#ffcb39" }}>
          Contents
        </a>
      </Menu.Item>

      {/* 관리자 메뉴 */}
      {user.userData && user.userData.isAuth && user.userData.isAdmin &&
        <SubMenu key="admin" title={<span>Admin</span>} style={{ border: 0 }}>
          {/* 영상 승인 */}
          <Menu.Item key="adminpage">
            <a selected="adminpage" href="/adminpage" style={{ color: "gray", fontWeight: "400", letterSpacing: "0" }}>
              콘텐츠 관리
            </a>
          </Menu.Item>

          {/* 공지사항 글쓰기 */}
          <Menu.Item key="write">
            <a selected="write" href="/board/write" style={{ color: "gray", fontWeight: "400", letterSpacing: "0" }}>
              글쓰기
            </a>
          </Menu.Item>
        </SubMenu>
      }
    </Menu>
  );
}

export default LeftMenu;
