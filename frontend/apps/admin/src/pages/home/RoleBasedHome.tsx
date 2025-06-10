import { useRecoilValue } from "recoil";
import userState from "recoils/atoms/auth/userState";
import useCheckUserRole from "hooks/auth/useCheckUserRole";
import GuestPage from "pages/guest";
import Host from "pages/host";
import Submission from "pages/submission";

const RoleBasedHome = () => {
  const userData = useRecoilValue(userState);
  const { isUser, isSuperAdmin, isAdmin } = useCheckUserRole(userData?.role);

  if (!userData || isAdmin) {
    return <Host />;
  }

  if (isSuperAdmin) return <Submission />;
  if (isUser) return <GuestPage />;
};

export default RoleBasedHome;
