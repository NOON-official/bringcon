import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode} style={{backgroundColor: "#1C1C1C"}}>
    <Menu.Item key="mail">
      <a href="/" style={{color: "#ffcb39"}}>Home</a>
    </Menu.Item>
    <SubMenu title={<span>Blogs</span>} style={{border: 0}}>
      <MenuItemGroup title="Item 1">
        <Menu.Item key="setting:1">Option 1</Menu.Item>
        <Menu.Item key="setting:2">Option 2</Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="Board">
      <Menu.Item key="setting:3">
          <a href="/board">공지사항</a>
        </Menu.Item>
        <Menu.Item key="setting:4">
          <a href="/board/write">글쓰기</a>
        </Menu.Item>
      </MenuItemGroup>
    </SubMenu>
  </Menu>
  )
}

export default LeftMenu