import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import HashTagPage from "./views/LandingPage/HashTagPage";
import CartPage from "./views/CartPage/CartPage";
import HistoryPage from "./views/HistoryPage/HistoryPage";
import CommunicationChat from "./views/Chatbot/Chat";
import BodyPage from "./views/Board/BodyPage";
import BoardWriteForm from "./views/Board/BoardWriteForm";
import BoardDetail from "./views/Board/BoardDetail";
import AddAccount from "./views/MyPage/AddAccount";
import MyPage from "./views/MyPage/MyPage";
import AdminLandingPage from "./admin/AdminLandingPage/AdminLandingPage";
import "./App.css";
import UserVideos from "./views/LandingPage/UserVideos";
import AdminDetailProductPage from "./admin/DetailProductPage/DetailProductPage";
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/product/upload"
            component={Auth(UploadProductPage, true)}
          />
          <Route
            exact
            path="/product/:productId"
            component={Auth(DetailProductPage, null)}
          />
          <Route
            exact
            path="/hashtag/:tag"
            component={Auth(HashTagPage, null)}
          />
          <Route
            exact
            path="/videos/:userId"
            component={Auth(UserVideos, null)}
          />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route
            exact
            path="/user/history"
            component={Auth(HistoryPage, true)}
          />
          <Route
            exact
            path="/user/account"
            component={Auth(AddAccount, true)}
          />
          <Route exact path="/user/mypage" component={Auth(MyPage, true)} />
          <Route exact path="/board" component={Auth(BodyPage, null)} />
          <Route
            exact
            path="/board/write"
            component={Auth(BoardWriteForm, true)}
          ></Route>
          <Route path="/board/detail" component={BoardDetail}></Route>
          // admin pages
          <Route
            exact
            path="/adminpage"
            component={Auth(AdminLandingPage, true, true)}
          />
          <Route
            exact
            path="/product_admin/:productId"
            component={Auth(AdminDetailProductPage, true, true)}
          />
        </Switch>
        <CommunicationChat />
      </div>
    </Suspense>
  );
}

export default App;
