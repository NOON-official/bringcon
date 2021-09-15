import React, { useState } from "react";
import { Form, Input, Col } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import VerticalMenu from '../VerticalMenu/VerticalMenu';
import Swal from 'sweetalert2';
import Success from '../../../utils/Success.svg';
import Error from '../../../utils/Success.svg';
import './UserInfo.css';
import mobile from '../../Main/mobile.png';

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
      Swal.fire(
        'Name?',
        '모든 값을 넣어주셔야 합니다.',
        'question'
      );
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      _id: user.userData._id,
      name: Name,
    };

    Axios.post("/api/users/info", body).then((response) => {
      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: '결제가 완료되었습니다',
          imageUrl: Success,
          imageWidth: 200,
          imageHeight: 176
        })
        props.history.goBack();
      } else {
        Swal.fire({
          title: 'Oops...!',
          text: '업데이트에 실패했습니다.',
          imageUrl: Error,
          imageWidth: 200,
          imageHeight: 176
        });
      }
    });
  };

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div>
      <div id="small-body">
        <img src={mobile} className="mobile"/>
    </div>
    <div id="body" style={{paddingTop: '50px', width: 'auto', margin: 'auto'}}>
      <Col style={{float: 'left', marginLeft: '84px', marginRight: '50px'}}>
        <VerticalMenu/>
      </Col>
      <Col style={{float: 'right', width: '1150px'}}>
      <div className="mypage-container" style={{maxWidth:'1092px'}}>
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
        <div className="nickname">
          <label className="mypage-label" style={{lineHeight: '32px'}}>닉네임 수정</label>
          <button type="submit" className="update-info">저장</button>
        </div>
        <div style={{ justifyContent: "space-between" }}>
          <label className="mypage-label" style={{marginRight: '40px'}}>닉네임</label>
          <Input className="mypage-input" onChange={NameChangeHandler} value={Name} />
          <br />
        </div>
        
      </Form>
      </div>
      </div>
    </div>
    </Col>
    </div>
    </div>
  );
}

export default UpdateUserInfo;
