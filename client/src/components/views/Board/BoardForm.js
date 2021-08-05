import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {} from "jquery.cookie";

class BoardRow extends Component {
  render() {
    return (
      <tr>
        <td>
            {this.props.createdAt.substring(0, 10)}
        </td>
        <td>
          <NavLink
            to={{ pathname: "/board/detail", query: { _id: this.props._id } }}
          >
            {this.props.title}
          </NavLink>
        </td>
        <td>
          {this.props.name}
        </td>
      </tr>
    );
  }
}

class BoardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {boardLists: []};
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
          boardList = boards.map((item) => (
            <BoardRow
              key={Date.now() + Math.random() * 500}
              _id={item._id}
              name={item.name}
              createdAt={item.createdAt}
              title={item.title}
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
      <div style={{width:'60%', margin:'auto'}}>
        <div style={divStyle}>
          <Table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>글 제목</th>
                <th>글쓴이</th>
              </tr>
            </thead>
            <tbody>{this.state.boardLists}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default BoardForm;
