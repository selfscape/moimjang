import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ThemeProvider } from "styled-components";

import { Pathnames } from "constants/index";
import GlobalStyles from "styles/GlobalStyles";
import theme from "styles/Theme";
import useCheckUserRole from "hooks/auth/useCheckUserRole";

import User from "pages/user";
import Channel from "pages/channel";
import UserDetail from "pages/user/UserDetail";
import ChannelForm from "pages/channel/form/ChannelForm";
import Brand from "pages/brand";
import EditBrand from "pages/brand/form/EditBrand";
import Landing from "pages/landing";
import Submission from "pages/submission";
import GuestPage from "pages/guest";
import Host from "pages/host";
import { useRecoilState } from "recoil";
import userState from "recoils/atoms/auth/userState";
import useStoreOwnerFromQuery from "hooks/auth/useStoreOwnerFromQuery";
import AdminSignUpForm from "pages/SignUpForm";
import Login from "pages/Login";

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
            <Route
              path={Pathnames.Home}
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
            <Route path={Pathnames.Login} element={<Login />} />
            <Route path={Pathnames.SignUp} element={<AdminSignUpForm />} />
            <Route path={Pathnames.Host} element={<Host />} />
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
            <Route path={`${Pathnames.Landing}`} element={<Landing />} />
            <Route path={`${Pathnames.Submission}`} element={<Submission />} />
          </Routes>
        </ThemeProvider>
      </DndProvider>
    </BrowserRouter>
  );
}

export default App;
