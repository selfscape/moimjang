import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userState from "recoils/atoms/auth/userState";

const RequireAuth = (Component: React.ComponentType) => {
  return function WithAuth(props: any) {
    const user = useRecoilValue(userState);

    if (!user) {
      return <Navigate to={`/login`} replace />;
    }

    return <Component {...props} />;
  };
};

export default RequireAuth;
