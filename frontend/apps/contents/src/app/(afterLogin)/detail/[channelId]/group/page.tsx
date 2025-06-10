import React from "react";
import Group from "./_components/Group";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "@/app/_components/RequireAuth";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <RequireAuth />
      <Group />;
    </>
  );
}
