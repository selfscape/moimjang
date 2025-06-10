import React from "react";
import Socialing from "./_components/SocialingEvents";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "../_components/RequireAuth";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <RequireAuth />
      <Socialing />;
    </>
  );
}
