import React, { useState, useEffect } from 'react';
import jQuery from 'jquery';
import axios from "axios";
import Swal from 'sweetalert2';
import './Payment.css';
  
function Payment(props) {
  const [MerchantId, setMerchantId] = useState('')
  const [OrderName, setOrderName] = useState('')
  const [PG, setPG] = useState('')
  const [PayMethod, setPayMethod] = useState('')
  const [Amount, setAmount] = useState(0)
  const [BuyerTel, setBuyerTel] = useState('')
  const [BuyerName, setBuyerName] = useState('')
  const [BuyerEmail, setBuyerEmail] = useState('')
  const [Saved, setSaved] = useState(false)

  //모든 주문 정보가 저장된 경우(Saved===true), 리렌더링 후 결제 진행
  useEffect(()=>{
    if(Saved === true){
      /* 1. 가맹점 식별하기 */
      var IMP = window.IMP;
      IMP.init('imp26939383');

      /* 2. 결제 데이터 정의하기 */
      const param = {
        pg: PG, // PG사
        pay_method: PayMethod, // 결제수단
        merchant_uid: MerchantId, // 주문번호
        amount: Amount,  // 결제금액
        name: OrderName, // 주문명
        buyer_name: BuyerName, // 구매자 이름
        buyer_tel: BuyerTel, // 구매자 전화번호
        buyer_email: BuyerEmail, // 구매자 이메일

        //모바일 환경 본인인증 후 리디렉션될 URL(imp_uid, merchant_uid, success 정보 전달됨)
        m_redirect_url: "http://bringcon.shop/payments/complete/mobile"
      };

      /* 4. 결제 창 호출하기 */
      IMP.request_pay(param, callback);
    }
    setSaved(false);
  }, [Saved])
  

  const saveOrder = (data) => {
    //주문 상품 번호 추가해야할듯(Product._id)
    const dataToSave = {
      pg: data.pg,
      payMethod: data.payMethod,
      amount: data.total,
      buyerId: data.userData._id,
      buyerName: data.userData.name,
      buyerEmail: data.userData.email
    }

     axios.post('/api/users/order', dataToSave)
        .then(response => {
            if (response.data.success) {
                setMerchantId(response.data.merchantId)
                setOrderName(response.data.orderName)
                setPG(response.data.pg)
                setPayMethod(response.data.payMethod)
                setAmount(response.data.amount)
                setBuyerTel(response.data.buyerTel)
                setBuyerName(response.data.buyerName)
                setBuyerEmail(response.data.buyerEmail)
                setSaved(true)
            } else {
                Swal.fire(
                  'Oops...',
                  '주문 정보를 저장하는 데 실패했습니다.',
                  'error'
                )
            }
        })
  }

  
  function onClickPayment(e) {
    e.preventDefault();

    //사용자가 결제 버튼 클릭시 해당 주문 정보를 DB에 저장
    saveOrder(props)
  }

  function onSuccess (data) {
    Swal.fire(
      'Success!',
      '결제가 완료되었습니다',
      'success'
    )
    props.onSuccess(data)
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(rsp) {
    if (rsp.success) { // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      Swal.fire(
        'Success!',
        '결제에 성공했습니다',
        'success'
      )
      // jQuery로 HTTP 요청
      jQuery.ajax({
        url: '/api/payments/complete', //가맹점 서버
        method: "POST",
        dataType: "json",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          imp_uid: rsp.imp_uid, //거래 고유 번호 - 아임포트 서버에서 결제 정보 조회 가능
          merchant_uid: rsp.merchant_uid //가맹점 DB 주문정보 조회 가능 -> 결제 위변조 검증
          //기타 필요한 데이터가 있는 경우 추가 전달
        }),
        error: function(e) {
          console.log(e);
        }  
      })
      .done(function (data) { // 응답 처리
        //step6 서버 응답 처리하기
        //가맹점 서버 결제 API 성공시 로직
        switch(data.status) {
          case "vbankIssued":
            // 가상계좌 발급 시 로직
            break;
          case "success":
            // 결제 성공 시 로직
            onSuccess(data.payment);
            break;
        }
      })

    } else {
      Swal.fire(
        'Oops...',
        '결제에 실패했습니다',
        'error'
      )
      // alert(`결제 실패: ${rsp.error_msg}`);
    }
  }

  return (
    <button className="pay-button" onClick={onClickPayment}>결제하기</button>
  );
}

export default Payment
