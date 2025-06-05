import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import React from "react";
import Form from "./_components/Form";

export default function page() {
  return (
    <div>
      <HeaderConfigurator
        config={{
          title: "프로필 수정",
          onBack: true,
        }}
      />

      <Form />
    </div>
  );
}
