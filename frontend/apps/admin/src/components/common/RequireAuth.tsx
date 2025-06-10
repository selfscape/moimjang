import { Navigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import userState from "recoils/atoms/auth/userState";
import { OWNER } from "configs";

const RequireAuth = (Component: React.ComponentType) => {
  return function WithAuth(props: any) {
    const location = useLocation();
    const user = useRecoilValue(userState);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const host = params.get("host");

      if (host) {
        document.cookie = `${OWNER}=${host}; path=/; max-age=${60 * 60 * 24}`;
        window.history.replaceState(null, "", location.pathname);
      }
    }, [location.search]);

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
};

export default RequireAuth;
