import React from "react";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import Form from "./_components/Form";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <div>
      <OwnerCookieSetter />
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
