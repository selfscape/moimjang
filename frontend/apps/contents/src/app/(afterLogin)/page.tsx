import React from "react";
import Socialing from "./_components/SocialingEvents";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <Socialing />;
    </>
  );
}
