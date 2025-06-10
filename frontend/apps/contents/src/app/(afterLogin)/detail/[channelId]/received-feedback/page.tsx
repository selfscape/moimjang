import React from "react";
import ReviewList from "./_components/ReviewList";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "@/app/_components/RequireAuth";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <RequireAuth />
      <ReviewList />;
    </>
  );
}
