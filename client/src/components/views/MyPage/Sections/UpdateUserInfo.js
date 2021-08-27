import React, { useState } from "react";
import { Form, Input, Col } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import VerticalMenu from '../../VerticalMenu/VerticalMenu';

const { TextArea } = Input;

function UpdateUserInfo(props) {
  const user = useSelector((state) => state.user);
  const [Name, setName] = useState("");
  const [toggleState, setToggleState] = useState(1);

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

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div id="body" style={{paddingTop: '50px', width: 'auto', margin: 'auto'}}>
      <Col style={{float: 'left', marginLeft: '84px', marginRight: '84px'}}>
        <VerticalMenu/>
      </Col>
      <Col style={{float: 'right'}}>
      <div className="mypage-container">
        <div className="mypage-bloc-tabs">
          <button
            className={toggleState === 1 ? "mypage-tabs active-tabs" : "mypage-tabs"}
            onClick={() => toggleTab(1)}
          >
            기본 정보
          </button>
        </div>
        <div className="mypage-content-tabs">
        <div
          className={toggleState === 1 ? "mypage-content  active-content" : "mypage-content"}
        >
      <Form onSubmit={submitHandler}>
        <div style={{ justifyContent: "space-between" }}>
          <label>이름</label>
          <Input onChange={NameChangeHandler} value={Name} />
          <br />
        </div>
        <button type="submit">제출</button>
      </Form>
      </div>
      </div>
    </div>
    </Col>
    </div>
  );
}

export default UpdateUserInfo;
