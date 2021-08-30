import React from "react";
import { Menu } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode} style={{ backgroundColor: "#1C1C1C" }}>
      {/* 어바웃 페이지 */}
      <Menu.Item key="about">
        <a href="#" style={{ color: "#ffcb39" }}>
          About
        </a>
      </Menu.Item>

      {/* 공지사항 */}

      {/* <Menu.Item key="notice">
        <a href="/board" style={{ color: "#ffcb39" }}>
          Notice
        </a>
      </Menu.Item> */}

      <SubMenu title={<span>Notice</span>} style={{ border: 0 }}>
        <Menu.Item key="setting:1">
          <a href="/board">공지사항</a>
        </Menu.Item>
        <Menu.Item key="setting:2">
          <a href="/board/write">글쓰기</a>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
}

export default LeftMenu;
