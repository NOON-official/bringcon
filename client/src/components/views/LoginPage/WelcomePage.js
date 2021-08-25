import React from "react";
import { withRouter } from "react-router-dom";
import SPLASH from "../../utils/SPLASH.gif";

function WelcomePage(props) {
  let hasInterests = false;

  if (
    props.user.userData &&
    props.user.userData.interests &&
    props.user.userData.interests.length > 0
  ) {
    console.log(props.user.userData.interests.length);
    hasInterests = true;
  }

  if (hasInterests) {
    setTimeout(() => {
      props.history.push("/");
    }, 3000);
  } else {
    setTimeout(() => {
      props.history.push("/user/interests");
    }, 3000);
  }

  return (
    <div>
      <img style={{ height: "100%", width: "100%" }} src={SPLASH}></img>
    </div>
  );
}

export default withRouter(WelcomePage);
