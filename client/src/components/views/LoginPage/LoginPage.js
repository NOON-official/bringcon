import React from "react";
import { withRouter } from "react-router-dom";
import LoginGoogle from "./sections/LoginGoogle";

function LoginPage() {
  return (
    <div>
      <LoginGoogle />
    </div>
  );
}

export default withRouter(LoginPage);
