import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Col} from "antd";
import Axios from "axios";
import Swal from "sweetalert2";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import mobile from '../../Main/mobile.png';
import "./ProfilePage.css";

function ProfilePage(props) {
  const user = useSelector((state) => state.user);
  const [toggleState, setToggleState] = useState(1);
  const [Tags, setTags] = useState([]);

  const GetUserInterests = () => {
    const user = useSelector((state) => state.user);
    const interests = user.userData && user.userData.interests;
    return interests;
  };

  let interests = GetUserInterests();

  useEffect(() => {
    async function fetchUserInterests() {
      const userInterests = await interests;
      setTags(userInterests);
    }
    fetchUserInterests();
  }, [interests]);

  useEffect(() => {
    if (user.userData) {
      UpdateTags();
    }
  }, [Tags]);

  const removeTags = (indexToRemove) => {
    setTags(Tags.filter((_, index) => index !== indexToRemove));
  };

  const addTags = (event) => {
    if (event.keyCode === 32 && event.target.value !== "") {
      setTags([...Tags, event.target.value.trim()]); //공백 제거
      event.target.value = "";
    }
  };

  function UpdateTags() {
    const body = {
      //로그인 된 사람의 ID
      _id: user.userData._id,
      interests: Tags,
    };

    Axios.post("/api/users/interests", body).then((response) => {
      if (response.data.success) {
      } else {
        alert("등록에 실패하였습니다. 관리자에게 문의하세요.");
      }
    });
  }

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div>
      <div id="small-body">
        <img src={mobile} className="mobile"/>
    </div>
    <div id="body" style={{ paddingTop: "50px", width: "auto", margin: "auto" }}>
      <Col style={{float: 'left', marginLeft: '84px', marginRight: 0}}>
        <VerticalMenu />
      </Col>
      <Col style={{float: 'right', width: '1150px'}}>
        <div className="mypage-container">
          <div className="mypage-bloc-tabs">
            <button
              className={
                toggleState === 1 ? "mypage-tabs active-tabs" : "mypage-tabs"
              }
              onClick={() => toggleTab(1)}
            >
              기본 정보
            </button>
          </div>
          <div className="mypage-content-tabs">
            <div
              className={
                toggleState === 1
                  ? "mypage-content  active-content"
                  : "mypage-content"
              }
            >
              <Col style={{ float: "left", borderRight: "3px solid #ffcb39" }}>
                <div className="profile-info">프로필 및 닉네임</div>
                <Avatar
                  src={user.userData && user.userData.image}
                  size="large"
                  className="mypage-avatar"
                ></Avatar>

                <div className="name-info">
                  {user.userData && user.userData.name}
                  <button className="change-info-basic">
                    <a href="/user/info">닉네임 수정</a>
                  </button>
                </div>
                <div className="email-info">
                  {user.userData && user.userData.name} (
                  {user.userData && user.userData.email} )
                </div>
                <div className="account-info-account">
                  <div className="info-title">계좌 정보</div>
                  {user.userData ? (
                    user.userData.accountNumber === undefined ? (
                      <a href="/user/account">계좌정보를 입력해주세요. </a>
                    ) : (
                      <span className="my-account">
                        {user.userData.bank}&nbsp;&nbsp;&nbsp;
                        {user.userData.accountNumber}
                      </span>
                    )
                  ) : (
                    <div></div>
                  )}
                  <button className="change-info-account">
                    <a href="/user/account">계좌 정보 수정</a>
                  </button>
                </div>
              </Col>

              <Col style={{ float: "right" }}>
                <div className="tag-info">
                  <span className="info-title-tag">선호하는 해시태그</span>
                  <div className="interest-tag-box">
                    <div className="interest-tags-input">
                      <input
                        className="interest-upload-tags"
                        type="text"
                        placeholder="스페이스바를 눌러 해시태그를 입력하세요"
                        onKeyUp={(e) => (e.keyCode === 32 ? addTags(e) : null)}
                      />
                    </div>
                    <div className="setting-tags-container">
                      <ul className="setting-tags">
                        {Tags &&
                          Tags.map((tag, index) => (
                            <li key={index} className="interest-tag">
                              <span>{tag}</span>
                              <span
                                className="interest-tag-close-icon"
                                onClick={() => removeTags(index)}
                              >
                                X
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </Col>
    </div>
    </div>
  );
}

export default ProfilePage;
