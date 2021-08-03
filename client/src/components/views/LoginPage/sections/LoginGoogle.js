import React from "react";
import { GoogleLogin } from "react-google-login";
import { loginUser } from "../../../../_actions/user_actions";
import { registerUser } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

function LoginGoogle(props) {
  const dispatch = useDispatch();

  const clientId =
    "868725939307-s3dblc74bco886t7kmimukn9rodb1vrj.apps.googleusercontent.com";

  const onSuccess = (res) => {
    let profile = res.getBasicProfile();
    console.log("Name : " + profile.getName());
    console.log("Image URL : " + profile.getImageUrl());
    console.log("Emai: " + profile.getEmail());
    console.log(profile);

    let dataToSubmit = {
      email: profile.getEmail(),
      password: "password",
      lastname: " ",
      image: profile.getImageUrl(),
      name: profile.getName(),
    };

    dispatch(registerUser(dataToSubmit)).then((response) => {
      if (response.payload.success) {
        alert("안뇽, 나는 쩌비야~~ ><");
      }
      dispatch(loginUser(dataToSubmit))
        .then((response) => {
          console.log(response);
          if (response.payload.loginSuccess) {
            props.history.push("/");
          }
        })
        .catch(() => {
          setTimeout(() => {
            console.log("erroer");
          }, 3000);
        });
    });
  };

  const onFailure = (res) => {
    console.log("[Login failed] res ", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default withRouter(LoginGoogle);
