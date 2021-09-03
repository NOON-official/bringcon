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
    "868725939307-s3dblc74bco886t7kmimukn9rodb1vrj.apps.googleusercontent.com";

  const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

  async function onSuccess(res) {
    const getChannelId = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${res.accessToken}`
      )
      .then((response) => {
        return response.data.items;
      })
      .catch((err) => console.log(err));

    const channelId = getChannelId;

    const profile = res.getBasicProfile();

    const dataToSubmit = {
      email: profile.getEmail(),
      image: profile.getImageUrl(),
      name: profile.getName(),
      channelId: channelId,
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
        scope={SCOPE}
      />
    </div>
  );
}

export default withRouter(LoginGoogle);
