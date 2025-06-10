import React from "react";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import Profile from "./_components/Profile";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <div>
      <OwnerCookieSetter />
      <HeaderConfigurator
        config={{
          title: "프로필",
          onBack: false,
        }}
      />
      <Profile />
    </div>
  );
}
