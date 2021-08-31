import React from "react";
import { withRouter } from "react-router-dom";
import {Col} from 'antd';
import LoginGoogle from "./sections/LoginGoogle";
import zzerby from '../LoginPage/sections/zzerby.svg';
import planet from '../LoginPage/sections/planet.svg';
import './sections/Login.css';

function LoginPage() {
  return (
    //네브바가 내려와서 위에 문구가 안 보임. 수정필요
    <div id="body" style={{paddingTop: '100px', width: 'auto'}}>
      <div className="login-form">
      <div className="login-announcement">
        <Col style={{float: 'left'}}>
        <img src={zzerby} className="zzerby"/>
        </Col>
        <Col style={{float: 'right', marginRight: '50px'}}>
        <p>원활한 우주여행을 위해<br/>구글 로그인을 해주세요!</p>
        <LoginGoogle />
        </Col>
      </div>
      </div>
      <div className="decorations">
        <img src={planet} className="planet"/>
      </div>
    </div>
  );
}

export default withRouter(LoginPage);
