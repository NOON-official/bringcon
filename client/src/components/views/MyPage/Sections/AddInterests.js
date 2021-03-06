import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Form } from "antd";
import "./UserInfo.css";
import Swal from "sweetalert2";
import mobile from '../../Main/mobile.png';
import Error from '../../../utils/Error.svg';
import Success from '../../../utils/Success.svg';

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
  const [CheckList, setCheckList] = useState([]);
  const onChangeEach = (e, id) => {
    // 체크할 시 CheckList에 id값 넣기
    if (e.target.checked) {
      setCheckList([...CheckList, id]);
      // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
    } else {
      setCheckList(CheckList.filter((checkedId) => checkedId !== id));
    }
  };
  const submitHandler = (event) => {
    event.preventDefault();
    if (CheckList.length < 1) {
      Swal.fire(
        'Data?',
        "하나 이상을 선택해주세요.",
        'question'
      );
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      _id: user.userData._id,
      interests: CheckList,
    };

    Axios.post("/api/users/interests", body).then((response) => {
      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "내 콘텐츠 행성에 여행객을 맞을 준비를 마쳤습니다.",
          imageUrl: Success,
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: "Custom image",
          background:
            "#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210830%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210830T044712Z&X-Amz-Expires=86400&X-Amz-Signature=6664bf9459c6e1d4115105918d83a1312ecb9ac22d9e751bc8c2b4b63321ee20&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)",
        });
        props.history.push("/");
      } else {
        Swal.fire({
          title: 'Oops...!',
          text: '상품을 가져오는데 실패했습니다.',
          imageUrl: Error,
          imageWidth: 200,
          imageHeight: 176,
          imageAlt: 'Custom Image',
          background: '#fff url(https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b2513ed5-eab8-4626-8a07-e788d7d9952e/BACK_star%28trans%29.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210901%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210901T051556Z&X-Amz-Expires=86400&X-Amz-Signature=e0cd25d9c0ca96f3cfa764e2a894db9f8f1b216d68f762ea97bedc9149d5abf6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22BACK_star%28trans%29.svg%22)',
        })
      }
    });
  };

  return (
    <div>
      <div id="small-body">
        <img src={mobile} className="mobile"/>
    </div>
    <div id="body" style={{ width: "auto" }}>
      <div
        style={{
          width: "90%",
          backgroundColor: "#1C1C1C",
          margin: "auto",
          paddingTop: "50px",
        }}
      >
        <div
          className="preference"
          style={{ textAlign: "center", marginBottom: "2rem", margin: "auto" }}
        >
          선호하는 키워드를 모두 선택하세요!
        </div>
        <Form onSubmit={submitHandler}>
          <div
            className="interest-row"
            style={{ width: "75%", margin: "auto" }}
          >
            {Options.map((option, index) => {
              return (
                <label className="interest-label" key={index}>
                  <input
                    type="checkbox"
                    className="interest-check"
                    onChange={(e) => onChangeEach(e, Options[index])}
                  />
                  <div className="interest-box">
                    <span>{option}</span>
                  </div>
                </label>
              );
            })}
            <div className="button-cell">
              <button type="submit" className="set-tags-button">
                여행 시작하기
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
    </div>
  );
}

export default AddInterests;
