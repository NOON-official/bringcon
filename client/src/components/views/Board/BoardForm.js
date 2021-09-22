import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./css/BoardForm.css";
import {} from "jquery.cookie";

class BoardRow extends Component {
  render() {
    return (
      <tr>
        <td className="notice-number" style={{ width: "10%" }}>
          {this.props.index}
        </td>

        <td className="notice-title" style={{ width: "60%" }}>
          <NavLink
            to={{ pathname: "/board/detail", query: { _id: this.props._id } }}
          >
            {this.props.title}
          </NavLink>
        </td>
        <td className="notice-wrtier" style={{ width: "15%" }}>
          {this.props.name}
        </td>
        <td className="notice-createdat" style={{ width: "15%" }}>
          {this.props.createdAt.substring(0, 10)}
        </td>
      </tr>
    );
  }
}

class BoardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { boardLists: [] };
  }

  componentDidMount() {
    this.getBoardList();
  }

  getBoardList = () => {
    const send_param = {
      //한명의 유저의 게시글만 보고 싶은 경우 id 넘겨줘야함
      // _id: "60f4f466763852667826c7da"
    };

    axios
      .post("/api/board/getBoardList", send_param)
      .then((returnData) => {
        let boardList;
        if (returnData.data.list.length > 0) {
          const boards = returnData.data.list;
          boardList = boards.map((item, index) => (
            <BoardRow
              key={Date.now() + Math.random() * 500}
              _id={item._id}
              name={item.name}
              createdAt={item.createdAt}
              title={item.title}
              index={index + 1}
            ></BoardRow>
          ));
          this.setState({
            boardLists: boardList,
          });
        } else {
          boardList = (
            <tr>
              <td colSpan="3">작성한 게시글이 존재하지 않습니다.</td>
            </tr>
          );
          this.setState({
            boardLists: boardList,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const divStyle = {
      margin: 50,
    };

    return (
      <div>
        <div
          className="notice"
          style={{ width: "80%", margin: "auto", marginBottom: "16px" }}
        >
          공지사항
        </div>
        <div style={{ width: "80%", margin: "auto" }} className="notice-table">
          <div
            style={divStyle}
            style={{ height: "515px", width: "1092px", overflow: "auto" }}
          >
            <Table style={{ width: "1000px", marginLeft: "40px" }}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th className="notice-title">글 제목</th>
                  <th>작성자</th>
                  <th>날짜</th>
                </tr>
              </thead>
              <tbody>{this.state.boardLists}</tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default BoardForm;
