import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ThemeProvider } from "styled-components";

import { AdminPathnames, Pathnames } from "constants/admin/index";
import GlobalStyles from "styles/GlobalStyles";
import theme from "styles/Theme";
import useCheckUserRole from "hooks/auth/useCheckUserRole";

import SignUpForm from "pages/consumer/SignUpForm";
import Login from "pages/consumer/Login";
import AdminLogin from "pages/admin/AdminLogin";
import Home from "pages/consumer/home/Home";
import ChannelDetail from "pages/consumer/home/channelDetail/index";
import GroupCheck from "pages/consumer/home/channelDetail/GroupCheck";
import MatchLog from "pages/consumer/home/channelDetail/MatchLog";
import ReviewForm from "pages/consumer/home/channelDetail/ReviewForm";
import ReviewList from "pages/consumer/home/channelDetail/ReviewList";
import Profile from "pages/consumer/profile/index";
import QuestionCardCategory from "pages/consumer/home/channelDetail/questionCardCategory";
import QuestionCard from "pages/consumer/home/channelDetail/questionCardCategory/QuestionCard";
import EditProfileForm from "pages/consumer/profile/EditProfileForm";
import User from "pages/admin/user";
import Channel from "pages/admin/channel";
import UserDetail from "pages/admin/user/UserDetail";
import ChannelForm from "pages/admin/channel/form/ChannelForm";
import Brand from "pages/admin/brand";
import EditBrand from "pages/admin/brand/form/EditBrand";
import Habit from "pages/plugins/Habit";
import Branding from "pages/plugins/landing";
import LandingDetail from "pages/plugins/landing/landingDetail";
import RegistForm from "pages/plugins/landing/RegistForm";
import SubmissionComplete from "pages/plugins/landing/SubmissionComplete";
import WriteReview from "pages/consumer/home/channelDetail/WriteReview";
import MoreReview from "pages/plugins/landing/landingDetail/MoreReview";
import Landing from "pages/admin/landing";
import Submission from "pages/admin/submission";
import GuestPage from "pages/admin/guest";
import Host from "pages/admin/host";
import { useRecoilState } from "recoil";
import userState from "recoils/atoms/auth/userState";
import useStoreOwnerFromQuery from "hooks/auth/useStoreOwnerFromQuery";
import AdminSignUpForm from "pages/admin/SignUpForm";

function App() {
  useStoreOwnerFromQuery();
  const [userData] = useRecoilState(userState);
  const { isUser, isSuperAdmin, isAdmin } = useCheckUserRole(userData?.role);

  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Routes>
            {/* 소비자 */}
            <Route path={Pathnames.Login} element={<Login />} />
            <Route path={Pathnames.Profile} element={<Profile />} />
            <Route path={Pathnames.EditProfile} element={<EditProfileForm />} />
            <Route path={Pathnames.SignUp} element={<SignUpForm />} />
            <Route path={"/"} element={<Home />} />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId`}
              element={<ChannelDetail />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/groupCheck`}
              element={<GroupCheck />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/matchLog`}
              element={<MatchLog />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/questionCard`}
              element={<QuestionCardCategory />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/questionCard/:categoryId`}
              element={<QuestionCard />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/reviewForm`}
              element={<ReviewForm />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/reviewList`}
              element={<ReviewList />}
            />
            <Route
              path={`${Pathnames.ChannelDetail}/:channelId/writereview`}
              element={<WriteReview />}
            />
            {/* 관리자 */}
            <Route
              path={Pathnames.AdminHome}
              element={
                isAdmin ? (
                  <Host />
                ) : isSuperAdmin ? (
                  <Submission />
                ) : (
                  isUser && <GuestPage />
                )
              }
            />
            <Route path={Pathnames.AdminLogin} element={<AdminLogin />} />
            <Route path={AdminPathnames.SignUp} element={<AdminSignUpForm />} />
            <Route path={AdminPathnames.Host} element={<Host />} />
            <Route path={Pathnames.User} element={<User />} />
            <Route
              path={`${Pathnames.User}/:userId`}
              element={<UserDetail />}
            />
            <Route path={Pathnames.Channel} element={<Channel />} />
            <Route path={Pathnames.CreateChannel} element={<ChannelForm />} />
            <Route
              path={`${Pathnames.EditChannel}/:channelId`}
              element={<ChannelForm />}
            />
            <Route path={Pathnames.Brand} element={<Brand />} />
            <Route
              path={`${Pathnames.EditBrand}/:brandId`}
              element={<EditBrand />}
            />
            <Route path={`${AdminPathnames.Landing}`} element={<Landing />} />
            <Route
              path={`${AdminPathnames.Submission}`}
              element={<Submission />}
            />
            {/* 브랜딩 */}
            <Route path={Pathnames.Habit} element={<Habit />} />
            <Route path={Pathnames.Landing} element={<Branding />} />
            <Route
              path={`${Pathnames.LandingProduct}/:brandId`}
              element={<LandingDetail />}
            />
            <Route
              path={`${Pathnames.LandingProduct}/:brandId/review`}
              element={<MoreReview />}
            />
            <Route path={Pathnames.RegistForm} element={<RegistForm />} />
            <Route
              path={Pathnames.SubmissionComplete}
              element={<SubmissionComplete />}
            />
          </Routes>
        </ThemeProvider>
      </DndProvider>
    </BrowserRouter>
  );
}

export default App;
