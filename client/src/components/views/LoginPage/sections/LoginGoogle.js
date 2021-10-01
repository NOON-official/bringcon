import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { loginUser } from "../../../../_actions/user_actions";
import { registerUser } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { error } from "jquery";
import './Login.css';

function LoginGoogle(props) {
  const dispatch = useDispatch();

  const clientId =
    "332971642208-6216d9hker7uhinuqp2atie05ktf0a1t.apps.googleusercontent.com";

  async function onSuccess(res) {

    const profile = res.getBasicProfile();

    const dataToSubmit = {
      email: profile.getEmail(),
      image: profile.getImageUrl(),
      name: profile.getName(),
    };

    dispatch(registerUser(dataToSubmit)).then((response) => {
      dispatch(loginUser(dataToSubmit))
        .then((response) => {
          if (response.payload.loginSuccess) {
            props.history.push("/welcome");
          }
        })
        .catch(() => {
          setTimeout(() => {
            console.log("error");
          }, 3000);
        });
    });
  }

  const onFailure = (res) => {
    alert("구글 로그인에 실패하였습니다");
    console.log("err", res);
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        className="google-button"
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default withRouter(LoginGoogle);
