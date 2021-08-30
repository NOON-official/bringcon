import React from "react";
import { withRouter } from "react-router-dom";
import SPLASH from "../../utils/SPLASH.gif";
import { useSelector } from "react-redux";
function HasInterests() {
  const user = useSelector((state) => state.user);
  if (user.loginSucces.interests.length > 0) {
    return true;
  } else {
    return false;
  }
}

function NoInterests(props) {
  setTimeout(() => props.history.push("/user/interests"), 3000);

  return (
    <div>
      <img style={{ height: "100%", width: "100%" }} src={SPLASH}></img>
    </div>
  );
}

function YesInterests(props) {
  setTimeout(() => props.history.push("/"), 3000);

  return (
    <div>
      <img style={{ height: "100%", width: "100%" }} src={SPLASH}></img>
    </div>
  );
}

function WelcomePage(props) {
  if (HasInterests()) {
    return <YesInterests history={props.history} />;
  } else {
    return <NoInterests history={props.history} />;
  }
}

export default withRouter(WelcomePage);
