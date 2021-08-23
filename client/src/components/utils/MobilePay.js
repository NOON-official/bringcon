import React, { useState, useEffect } from 'react';
import jQuery from 'jquery';
import axios from "axios";
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
// import { response } from 'express';
  
function MobilePay(props) {
    // const { location } = history;
    // const { search } = location;
    // const query = queryString.parse(search);
    // console.log(query)
    
    function onSuccess (data) {
        alert('결제가 완료되었습니다.');
        props.onSuccess(data)
    }
    
    axios.get(`/api/payments/complete/mobile`)
    .then(data => {
        console.log(data);
        
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

    // const { location } = history;
    // const { search } = location;
    // const query = queryString.parse(search);
    // console.log(query)
    // const {imp_uid, merchant_uid, imp_success} = query;
    return (
       <div>모바일 결제 테스트</div>
        // <span>모바일 결제: {response}</span>,
        // <span>response: {response.data}</span>
      );
}

export default MobilePay