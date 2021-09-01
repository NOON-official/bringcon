import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useSelector } from "react-redux";
import $ from 'jquery'

function LeftMenu(props) {
  const user = useSelector((state) => state.user);
  const [Selected, setSelected] = useState([])

  // 선택된 메뉴 bold 처리
  $(".ant-menu-item a").each(
    function() {
      // 현재 위치에 해당하는 NavBar key 설정하기   
      if(window.location.href === this.href && Selected.length === 0) {
        console.log(this.selected)
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

      {/* 공지사항 글쓰기(관리자만 보임) */}
      {user.userData && user.userData.isAuth && user.userData.isAdmin &&
        <Menu.Item key="write">
          <a selected="write" href="/board/write" style={{ color: "#ffcb39" }}>
            Write
          </a>
        </Menu.Item>
      }
    </Menu>
  );
}

export default LeftMenu;
