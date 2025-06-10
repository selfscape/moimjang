import React from "react";
import Group from "./_components/Group";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <Group />;
    </>
  );
}
