import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Checkbox, Row, Col, Form } from "antd";

function AddInterests(props) {
  const user = useSelector((state) => state.user);
  const [checkedList, setCheckedList] = useState([]);
  const onChange = (list) => {
    setCheckedList(list);
    console.log("list", list);
  };
  console.log("chkeckedList", checkedList);

  const submitHandler = (event) => {
    event.preventDefault();
    if (checkedList.length < 1) {
      return alert("하나 이상을 선택해주세요. ");
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      _id: user.userData._id,
      interests: checkedList,
    };

    Axios.post("/api/users/interests", body).then((response) => {
      if (response.data.success) {
        alert("선호 태그 등록 완료");
        props.history.push("/");
      } else {
        alert("등록에 실패하였습니다. 관리자에게 문의하세요.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2> 선호하는 키워드를 모두 선택하세요! </h2>
      </div>
      <Form onSubmit={submitHandler}>
        <Checkbox.Group onChange={onChange}>
          <Row>
            <Col span={4}>
              <Checkbox value="동물">동물</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="음식">음식</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="클립영상">클립영상</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="유머">유머</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="게임">게임</Checkbox>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Checkbox value="애니메이션">애니메이션</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="일상">일상</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="음악">음악</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="뉴스">뉴스</Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox value="영화 및 TV">영화 및 TV</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        <button type="submit">여행 시작하기</button>
      </Form>
    </div>
  );
}

export default AddInterests;
