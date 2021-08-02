import React, {Component} from 'react';
import { Table, Button } from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
const headers = {withCredentials: true};

class BoardDetail extends Component {
    state = {
        board: []
    };

    componentDidMount() {
        if (this.props.location.query !== undefined) {
            this.getDetail();
        } else {
            window.location.href="/";
        }
    }

    deleteBoard = _id => {
        const send_param = {
            headers,
            _id
        };
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios
                .post("/api/board/delete", send_param)
                //정상!
                .then(returnData => {
                    alert("삭제되었습니다.");
                    window.location.href="/";
                })
                //에러
                .catch(err => {
                    console.log(err);
                    alert("삭제에 실패했습니다.")
                });
        }
    };

    getDetail = () => {
        const send_param = {
            headers,
            _id: this.props.location.query._id
        };
        const marginBottom = {
            marginBottom: 5
        };
        axios
            .post("/api/board/detail", send_param)
            //정상!
            .then(returnData => {
                if (returnData.data.board[0]) {
                    const board = (
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>{returnData.data.board[0].title}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td dangerouslySetInnerHTML={{
                                            _html: returnData.data.board[0].content
                                        }}></td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div>
                        <NavLink
                                to={{
                                    pathname: "/boardWrite",
                                    query: {
                                        title: returnData.data.board[0].title,
                                        content: returnData.data.board[0].content,
                                        _id: this.props.location.query._id
                                    }
                                }}
                        >
                            <Button block style={marginBottom}>
                                글 수정
                            </Button>
                        </NavLink>
                        <Button
                            block
                            onClick={this.deleteBoard.bind(
                                null, this.props.location.query._id
                            )}>
                                글 삭제
                            </Button>
                            </div>
                        </div>
                    );
                    this.setState({board: board});
                }
            })
            //에러
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const divStyle = {
            margin: 50
        };
        return <div style={divStyle}>{this.state.board}</div>;
    }
}

export default BoardDetail;