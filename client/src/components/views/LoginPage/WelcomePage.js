import React from "react";
import { withRouter } from "react-router-dom";
import SPLASH from "../../utils/SPLASH.gif";
import { useSelector } from "react-redux";
import mobile from '../Main/mobile.png';

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
      <div id="small-body">
        <img src={mobile} className="mobile"/>
      </div>
    <div>
      <img style={{ height: "100%", width: "100%" }} src={SPLASH}></img>
    </div>
    </div>
  );
}

function YesInterests(props) {
  setTimeout(() => props.history.push("/contents"), 3000);

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
