import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Checkbox, Row, Col, Form } from "antd";
import '../css/UserInfo.css';
const Options = [
  "동물",
  "음식",
  "클립영상",
  "유머",
  "게임",
  "애니메이션",
  "일상",
  "음악",
  "뉴스",
  "영화 및 TV",
];

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
    <div id="body">
    <div style={{width: '90%', backgroundColor: '#1C1C1C', margin: 'auto', paddingTop: '50px'}}>
      <div style={{textAlign: "center", marginBottom: "2rem", margin: 'auto'}}>
        <h2> 선호하는 키워드를 모두 선택하세요! </h2>
      </div>
      <Form onSubmit={submitHandler}>
        <div className="interest-row" style={{width: '80%', margin: 'auto'}}>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="동물" onChange={onChange}/>
          <div className="interest-box">
            <span>동물</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="음식" onChange={onChange}/>
          <div className="interest-box">
            <span>음식</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="애니메이션" onChange={onChange}/>
          <div className="interest-box">
            <span>애니메이션</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="일상" onChange={onChange}/>
          <div className="interest-box">
            <span>일상</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="게임" onChange={onChange}/>
          <div className="interest-box">
            <span>게임</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="클립영상" onChange={onChange}/>
          <div className="interest-box">
            <span>클립영상</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="음악" onChange={onChange}/>
          <div className="interest-box">
            <span>음악</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="유머" onChange={onChange}/>
          <div className="interest-box">
            <span>유머</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="뉴스" onChange={onChange}/>
          <div className="interest-box">
            <span>뉴스</span>
          </div>
        </label>
        <label className="interest-label">
          <input type="checkbox" className="interest-check" value="영화 및 TV" onChange={onChange}/>
          <div className="interest-box">
            <span>영화 및 TV</span>
          </div>
        </label>
        </div>
        <button type="submit">여행 시작하기</button>
      </Form>
    </div>
    </div>
  );
}

export default AddInterests;
