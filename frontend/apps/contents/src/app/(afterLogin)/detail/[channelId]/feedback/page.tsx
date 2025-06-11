import React from "react";
import styles from "./page.module.css";
import Form from "./_components/Form";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import RequireAuth from "@/app/_components/RequireAuth";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <RequireAuth />
      <HeaderConfigurator
        config={{
          title: "대화 후기 남기기",
          onBack: true,
        }}
      />
      <div className={styles.sectionContainer}>
        <Form />
      </div>
    </>
  );
}
