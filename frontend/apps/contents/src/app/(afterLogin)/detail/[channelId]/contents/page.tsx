import React from "react";
import ContentBox from "./_components/ContentBox";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "@/app/_components/RequireAuth";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <RequireAuth />
      <ContentBox />;
    </>
  );
}
