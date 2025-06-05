import React from "react";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import Profile from "./_components/Profile";

export default function page() {
  return (
    <div>
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
