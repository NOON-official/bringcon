import React, { useState } from "react";
import { Form, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
const { TextArea } = Input;

const Banks = [
  { key: 0, value: "NH농협" },
  { key: 1, value: "KB국민" },
  { key: 2, value: "신한" },
  { key: 3, value: "우리" },
  { key: 4, value: "하나" },
  { key: 5, value: "IBK기업" },
  { key: 6, value: "SC제일" },
  { key: 7, value: "씨티" },
  { key: 8, value: "KDB산업" },
  { key: 9, value: "SBI저축은행" },
  { key: 10, value: "새마을" },
  { key: 11, value: "대구" },
  { key: 12, value: "광주" },
  { key: 13, value: "우체국" },
  { key: 14, value: "신협" },
  { key: 15, value: "전북" },
  { key: 16, value: "경남" },
  { key: 17, value: "부산" },
  { key: 18, value: "수협" },
  { key: 19, value: "제주" },
  { key: 20, value: "저축은행" },
  { key: 21, value: "산림조합" },
  { key: 22, value: "토스뱅크" },
  { key: 23, value: "케이뱅크" },
  { key: 24, value: "카카오뱅크" },
  { key: 25, value: "HSBC" },
  { key: 26, value: "중국공상" },
  { key: 27, value: "JP모간" },
  { key: 28, value: "도이치" },
  { key: 29, value: "BNP파리바" },
  { key: 30, value: "BOA" },
  { key: 31, value: "중국건설" },
];

function AddAccount(props) {
  const user = useSelector((state) => state.user);
  const [Bank, setBank] = useState(1);
  const [Number, setNumber] = useState();
  const [Holder, setHolder] = useState("");

  const BankChangeHandler = (event) => {
    setBank(event.currentTarget.value);
  };

  const NumberChangeHandler = (event) => {
    setNumber(event.currentTarget.value);
  };

  const HolderChangeHandler = (event) => {
    setHolder(event.currentTarget.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!Bank || !Holder || !Number) {
      return alert(" 모든 값을 넣어주셔야 합니다.");
    }

    //서버에 채운 값들을 request로 보낸다.

    const body = {
      //로그인 된 사람의 ID
      _id: user.userData._id,
      accountHolder: Holder,
      accountNumber: Number,
      Bank: Banks[Bank].value,
    };

    Axios.post("/api/users/account", body).then((response) => {
      if (response.data.success) {
        alert("계좌 업로드에 성공 했습니다.");
        props.history.push("/product/upload");
      } else {
        alert("계좌 업로드에 실패 했습니다.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2> 판매자 정보 입력 </h2>
      </div>

      <Form onSubmit={submitHandler}>
        <div style={{ justifyContent: "space-between" }}>
          <label>예금주</label>
          <Input onChange={HolderChangeHandler} value={Holder} />
          <br />
          <br />
          <label>계좌번호</label>
          <Input type="number" onChange={NumberChangeHandler} value={Number} />
          <br />
          <br />
          <label>은행 : </label>
          <select onChange={BankChangeHandler} value={Bank}>
            {Banks.map((item) => (
              <option key={item.key} value={item.key}>
                {" "}
                {item.value}
              </option>
            ))}
          </select>
          <br />
          <br />
        </div>
        <button type="submit">제출</button>

        <br />
        <div>
          [이용약관 13조 2항] 회원의 컴퓨터 오류, 신상정보의 부정확한 기재,
          비밀번호 관리의 소홀, 일치하지 않는 계좌번호 입력, 가입 시 계좌번호
          미확인 등 회원의 귀책사유로 인해 손해가 발생한 경우에 대하여 회사는
          책임을 지지 않습니다.
        </div>
      </Form>
    </div>
  );
}

export default AddAccount;
