import React from "react";
import ContentBox from "./_components/ContentBox";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <ContentBox />;
    </>
  );
}
