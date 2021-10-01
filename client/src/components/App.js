import React, { Suspense } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Auth from "../hoc/auth";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// pages for this product
import LawUse from "./views/Law/LawUse";
import LawPersonal from "./views/Law/LawPersonal";
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import NavBar from "./views/NavBar/NavBar";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import HashTagPage from "./views/LandingPage/HashTagPage";
import CartPage from "./views/CartPage/CartPage";
import HistoryPage from "./views/MyPage/HistoryPage/HistoryPage";
import CommunicationChat from "./views/Chatbot/Chat";
import BodyPage from "./views/Board/BodyPage";
import BoardWriteForm from "./views/Board/BoardWriteForm";
import BoardDetail from "./views/Board/BoardDetail";
import AddAccount from "./views/MyPage/Sections/AddAccount";
import AddInterests from "./views/MyPage/Sections/AddInterests";
import ProfilePage from "./views/MyPage/ProfilePage/ProfilePage";
import WelcomePage from "./views/LoginPage/WelcomePage";
import AdminLandingPage from "./admin/AdminLandingPage/AdminLandingPage";
import "./App.css";
import UserVideoPage from "./views/LandingPage/UserVideoPage";
import AdminDetailProductPage from "./admin/AdminDetailPage/AdminDetailPage";
import UpdateUserInfo from "./views/MyPage/Sections/UpdateUserInfo";
import Payment from "./utils/Payment";
import MyContentsPage from "./views/MyPage/MyContentsPage/MyContentPage";
import UpdateContentPage from "./views/MyPage/MyContentsPage/UpdateContentPage";
import ReviewPage from "./views/MyPage/ReviewPage/ReviewPage";
import UpdateReviewPage from "./views/MyPage/ReviewPage/UpdateReviewPage";
import Main from "./views/Main/Main";
import About from "./views/About/About";
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Route>
          <TransitionGroup className="transition-group">
            <CSSTransition
              key={location.pathname}
              classNames="slide"
              timeout={{ enter: 1000, exit: 1000 }}
            >
              <Switch>
                <Route
                  exact
                  path="/contents"
                  component={Auth(LandingPage, null)}
                />
                <Route
                  exact
                  path="/welcome"
                  component={Auth(WelcomePage, null)}
                />
                <Route exact path="/login" component={Auth(LoginPage, false)} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <Switch>
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
              component={Auth(UserVideoPage, null)}
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
            <Route
              exact
              path="/user/interests"
              component={Auth(AddInterests, true)}
            />
            <Route
              exact
              path="/user/info"
              component={Auth(UpdateUserInfo, true)}
            />
            <Route
              exact
              path="/user/profile"
              component={Auth(ProfilePage, true)}
            />
            <Route exact path="/board" component={Auth(BodyPage, null)} />

            <Route
              exact
              path="/board/write"
              component={Auth(BoardWriteForm, true, true)}
            ></Route>
            <Route exact path="/board/detail" component={BoardDetail}></Route>

            <Route exact path="/" component={Auth(Main, null)}></Route>

            {/* admin pages */}
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
            <Route
              exact
              path="/payments/complete"
              component={Auth(Payment, true, true)}
            />
            <Route
              exact
              path="/user/mycontents"
              component={Auth(MyContentsPage, true)}
            />
            <Route
              exact
              path="/user/mycontents/update"
              component={Auth(UpdateContentPage, true)}
            />
            <Route
              exact
              path="/user/review"
              component={Auth(ReviewPage, true)}
            />
            <Route
              exact
              path="/user/review/update"
              component={Auth(UpdateReviewPage, true)}
            />
            <Route exact path="/about" component={Auth(About, null)} />
            <Route
              exact
              path="/law/personal"
              component={Auth(LawPersonal, null)}
            />
            <Route exact path="/law/use" component={Auth(LawUse, null)} />
          </Switch>
        </Route>
        <CommunicationChat />
      </div>
    </Suspense>
  );
}

export default App;
