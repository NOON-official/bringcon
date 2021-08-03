import React, { useState } from "react";
import { CKEditor } from "ckeditor4-react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

function BoardWriteForm(props) {
  const user = useSelector((state) => state.user);
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const contentChangeHandler = (event) => {
    const data = event.editor.getData();
    setContent(data);
  };

  const writeBoardHandler = (event) => {
    event.preventDefault();

    if (!Title || Title.length === 0) {
      alert("제목을 입력해주세요");
    } else if (!Content || Content.length === 0) {
      alert("내용을 입력해주세요");
    }

    const body = {
      headers,
      writer: user.userData._id,
      title: Title,
      content: Content,
    };

    axios.post("/api/board", body).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        alert("게시글 업로드에 성공했습니다.");
        props.history.push("/");
      } else {
        console.log("hello");
        alert("글쓰기에 실패했습니다.");
      }
    });
  };

  const divStyle = {
    margin: 50,
  };
  const titleStyle = {
    marginBottom: 5,
  };
  const buttonStyle = {
    marginTop: 5,
  };

  return (
    <div style={divStyle} className="App">
      <h2>글 쓰기</h2>
      <Form onSubmit={writeBoardHandler}>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="글 제목"
          onChange={titleChangeHandler}
          value={Title}
        />
        <CKEditor data={Content} onChange={contentChangeHandler}></CKEditor>
        <Button style={buttonStyle} type="submit" block>
          저장하기
        </Button>
      </Form>
    </div>
  );
}

export default BoardWriteForm;
