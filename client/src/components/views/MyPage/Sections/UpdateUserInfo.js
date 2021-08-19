import React, { useState } from "react";
import { Form, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
const { TextArea } = Input;

function UpdateUserInfo(props) {
  const user = useSelector((state) => state.user);
  const [Name, setName] = useState("");

  const NameChangeHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!Name) {
      return alert(" 모든 값을 넣어주셔야 합니다.");
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      _id: user.userData._id,
      name: Name,
    };

    Axios.post("/api/users/info", body).then((response) => {
      if (response.data.success) {
        alert("업데이트 성공");
        props.history.goBack();
      } else {
        alert("업데이트 실패.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2> 회원 정보 수정 </h2>
      </div>

      <Form onSubmit={submitHandler}>
        <div style={{ justifyContent: "space-between" }}>
          <label>이름</label>
          <Input onChange={NameChangeHandler} value={Name} />
          <br />
        </div>
        <button type="submit">제출</button>
      </Form>
    </div>
  );
}

export default UpdateUserInfo;
