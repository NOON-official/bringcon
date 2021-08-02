import React, {Component} from 'react';
import {CKEditor} from 'ckeditor4-react';
import axios from 'axios';
import $ from 'jquery';
import {} from 'jquery.cookie';
import { Button, Form} from "react-bootstrap";
axios.defaults.withCredentials = true;
const headers = {withCredentials: true};

class BoardWriteForm extends Component {
    state = {
        data: ""
    };

    componentDidMount() {
        if (this.props.location.query !== undefined) {
            this.boardTitle.value = this.props.location.query.title;
        }
    }

    componentWillMount(){
        if (this.props.location.query !== undefined) {
            this.setState({
                data: this.props.location.query.content
            })
        }
    }

    writeBoard = () => {
        let url;
        let send_param;

        const boardTitle = this.boardTitle.value;
        const boardContent = this.state.data;

        if (boardTitle === undefined || boardTitle === "") {
            alert("제목을 입력해주세요");
            boardTitle.focus();
            return;
        } else if (boardContent === undefined || boardContent === "") {
            alert("글 내용을 입력해주세요");
            boardContent.focus();
        }

        if (this.props.location.query !== undefined) {
            url = "http://localhost:8080/board/update";
            send_param = {
                headers,
                "_id": $.cookie("login_id"),
                "title": boardTitle,
                "content": boardContent
            };
        }

        axios
            .post(url, send_param)
            //정상!
            .then(returnData => {
                if (returnData.data.message) {
                    alert(returnData.data.message);
                    window.location.href="/";
                } else {
                    alert("글쓰기에 실패했습니다.")
                }
            })
            //에러
            .catch(err => {
                console.log(err);
            });
    };

    onEditorChange = (event) => {
        this.setState({
            data: event.editor.getData
        });
    };
    render() {
        const divStyle = {
            margin: 50
        };
        const titleStyle = {
            marginBottom: 5
        };
        const buttonStyle = {
            marginTop: 5
        };

        return (
            <div style={divStyle} className="App">
                <h2>글 쓰기</h2>
                <Form.Control
                    type="text"
                    style={titleStyle}
                    placeholder="글 제목"
                    ref={ref => (this.boardTitle = ref)}/>
                <CKEditor
                    data={this.state.data}
                    onChange={this.onEditorChange}>
                </CKEditor>
                <Button style={buttonStyle} onClick={this.writeBoard} block>
                    저장하기
                </Button>
            </div>
        );
    }
}

export default BoardWriteForm;