import { useRecoilValue } from "recoil";
import userState from "recoils/atoms/auth/userState";
import { Navigate } from "react-router-dom";
import useCheckUserRole from "hooks/auth/useCheckUserRole";
import GuestPage from "pages/guest";
import Host from "pages/host";
import Submission from "pages/submission";

const RoleBasedHome = () => {
  const userData = useRecoilValue(userState);
  const { isUser, isSuperAdmin, isAdmin } = useCheckUserRole(userData?.role);

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) return <Host />;
  if (isSuperAdmin) return <Submission />;
  if (isUser) return <GuestPage />;

  return <Navigate to="/login" replace />;
};

export default RoleBasedHome;
