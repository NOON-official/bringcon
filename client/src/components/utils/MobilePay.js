import React, { useState, useEffect } from 'react';
import jQuery from 'jquery';
import axios from "axios";
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
// import { response } from 'express';
  
function MobilePay({history}) {
    const { location } = history;
    const { search } = location;
    const query = queryString.parse(search);
    console.log(query)
    const {imp_uid, merchant_uid, imp_success} = query;
    return (
        // <span>모바일 결제: {response}</span>,
        <span>query: {query.merchant_uid}</span>
      );
}

export default MobilePay