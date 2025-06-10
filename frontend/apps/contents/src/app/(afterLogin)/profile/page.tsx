import React from "react";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import Profile from "./_components/Profile";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "@/app/_components/RequireAuth";

export default function page() {
  return (
    <div>
      <OwnerCookieSetter />
      <RequireAuth />
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
