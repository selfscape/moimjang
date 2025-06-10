import React from "react";
import styles from "./page.module.css";
import Form from "./_components/Form";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";

export default function page() {
  return (
    <>
      <OwnerCookieSetter />
      <HeaderConfigurator
        config={{
          title: "리뷰 남기기",
          onBack: true,
        }}
      />
      <div className={styles.sectionContainer}>
        <Form />
      </div>
    </>
  );
}
