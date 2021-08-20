import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "./css/BoardDetail.css";

class BoardDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { board: [] };
    this.state = { writer: "" };
    this.state = { isSame: false };
  }

  componentDidMount() {
    if (this.props.location.query !== undefined) {
      this.getDetail();
    } else {
      window.location.href = "/board";
    }
  }

  deleteBoard = (_id) => {
    const send_param = {
      _id,
    };

    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .post("/api/board/delete", send_param)
        //정상!
        .then((returnData) => {
          if (returnData.data.success) {
            alert("삭제되었습니다.");
            window.location.href = "/";
          } else {
            alert("삭제에 실패했습니다.");
          }
        })
        //에러
        .catch((err) => {
          console.log(err);
        });
    }
  };

  getDetail = () => {
    const send_param = {
      _id: this.props.location.query._id, //게시물 고유번호
    };
    const marginBottom = {
      marginBottom: 5,
    };
    axios
      .post("/api/board/detail", send_param)
      //정상!
      .then((returnData) => {
        if (returnData.data.board[0]) {
          //해당 게시물이 있으면

          // 게시물 writer에게만 수정/삭제 버튼 보여주기
          const { storeUser } = this.props; //현재 로그인한 유저 _id
          this.setState({ writer: returnData.data.board[0].writer }); //게시물 쓴 사람 _id

          // 로그인 된 상태이고 && 로그인한 유저 === 게시물 쓴 사람이면
          if (
            storeUser.hasOwnProperty("_id") &&
            storeUser._id === this.state.writer
          ) {
            this.setState({ isSame: true });
          } else {
            this.setState({ isSame: false });
          }

          const board = (
            <div style={{ width: "60%", margin: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th id="title" className="content">
                      {returnData.data.board[0].title}
                    </th>
                  </tr>
                  <tr>
                    <td id="writer" className="content">
                      <span>{`Writer  `}</span>
                      {returnData.data.board[0].name}
                    </td>
                  </tr>
                  <tr>
                    <td id="date" className="content">
                      <span>{`Date  `}</span>
                      {returnData.data.board[0].createdAt.substring(0, 10)}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="content"
                      colSpan="2"
                      dangerouslySetInnerHTML={{
                        __html: returnData.data.board[0].content,
                      }}
                    />
                  </tr>
                </tbody>
              </Table>
              <div>
                <br />
                <NavLink
                  to={{
                    pathname: "/board/write",
                    query: {
                      title: returnData.data.board[0].title,
                      content: returnData.data.board[0].content,
                      _id: this.props.location.query._id,
                    },
                  }}
                >
                  <Button
                    block
                    style={
                      (marginBottom,
                      {
                        display: `${
                          this.state.isSame ? "inline-block" : "none"
                        }`,
                      })
                    }
                  >
                    글 수정
                  </Button>
                </NavLink>
                <Button
                  style={{
                    display: `${this.state.isSame ? "inline-block" : "none"}`,
                  }}
                  block
                  onClick={this.deleteBoard.bind(
                    null,
                    this.props.location.query._id
                  )}
                >
                  글 삭제
                </Button>
              </div>
            </div>
          );
          this.setState({ board: board });
        }
      })
      //에러
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const divStyle = {
      margin: 50,
    };

    return <div style={divStyle}>{this.state.board}</div>;
  }
}

const mapStateToProps = (state) => ({
  storeUser: state.user.userData,
});

export default connect(mapStateToProps)(BoardDetail);
