import React, { useState, useEffect } from "react";
import { CKEditor } from "ckeditor4-react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./css/BoardWrite.css"

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

    //게시글 수정하는 경우
    useEffect(() => {
      if(props.location.query !== undefined) {
        setTitle(props.location.query.title)
        setContent(props.location.query.content)
      }
      console.log(props.location.hasOwnProperty('query'))
      console.log(props.location.query)
    }, [])

  const writeBoardHandler = (event) => {
    event.preventDefault();

    if (!Title || Title.length === 0) {
      return alert("제목을 입력해주세요");
    } else if (!Content || Content.length === 0) {
      return alert("내용을 입력해주세요");
    }
    
    //게시물 수정하는 경우
    if(props.location.hasOwnProperty('query')){
      const body = {
        _id: props.location.query._id,
        title: Title,
        content: Content,
      }

      axios.post("/api/board/update", body).then((response) => {
        if (response.data.success) {
          console.log(response.data);
          alert("게시글 수정에 성공했습니다.");
          props.history.push("/board");
        } else {
          alert("게시글 수정에 실패했습니다.");
        }
      });

    } else { //새로운 게시글 올리는 경우
      const body = {
        writer: user.userData._id,
        name: user.userData.name,
        title: Title,
        content: Content,
      };
  
      axios.post("/api/board/upload", body).then((response) => {
        if (response.data.success) {
          console.log(response.data);
          alert("게시글 업로드에 성공했습니다.");
          props.history.push("/board");
        } else {
          alert("글쓰기에 실패했습니다.");
        }
      });
    }
  };

  const divStyle = {
    margin: 50,
    width: '60%',
    margin: 'auto'
  };
  const titleStyle = {
    marginBottom: 5,
    width: '50%',
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
        <CKEditor initData={props.location.hasOwnProperty('query') && props.location.query.content} data={Content} onChange={contentChangeHandler}></CKEditor>
        <Button style={buttonStyle} type="submit" block>
          저장하기
        </Button>
      </Form>
    </div>
  );
}

export default BoardWriteForm;
