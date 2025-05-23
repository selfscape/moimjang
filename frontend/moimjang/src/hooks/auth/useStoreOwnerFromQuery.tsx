import { useEffect } from "react";

const useStoreOwnerFromQuery = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const host = params.get("host");
    if (host) {
      localStorage.setItem("Owner", host);
    }
  }, []);

  return null;
};

export default useStoreOwnerFromQuery;
