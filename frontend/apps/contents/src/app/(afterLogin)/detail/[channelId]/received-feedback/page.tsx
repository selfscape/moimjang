import React from "react";
import ReviewList from "./_components/ReviewList";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <ReviewList />;
    </>
  );
}
