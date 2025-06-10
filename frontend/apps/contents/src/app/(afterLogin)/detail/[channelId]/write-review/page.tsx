import React from "react";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import Form from "./_components/Form";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "@/app/_components/RequireAuth";

export default function page() {
  return (
    <div>
      <OwnerCookieSetter />
      <RequireAuth />
      <HeaderConfigurator
        config={{
          title: "리뷰 작성하기",
          onBack: true,
        }}
      />
      <Form />
    </div>
  );
}
