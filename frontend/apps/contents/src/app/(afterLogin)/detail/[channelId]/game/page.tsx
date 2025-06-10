import React from "react";
import Game from "./_components/Game";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <Game />
    </>
  );
}
