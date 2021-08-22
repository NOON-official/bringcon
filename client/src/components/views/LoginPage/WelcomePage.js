import React from "react";
import { withRouter } from "react-router-dom";
import SPLASH from "../../utils/SPLASH.gif";

function WelcomePage(props) {
  console.log(props);
  setTimeout(() => {
    props.history.push("/");
  }, 3000);
  return (
    <div>
      <img style={{ height: "100%", width: "100%" }} src={SPLASH}></img>
    </div>
  );
}

export default withRouter(WelcomePage);
