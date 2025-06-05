import React from "react";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import Form from "./_components/Form";

export default function page() {
  return (
    <div>
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
