import React from "react";
import styles from "./page.module.css";

import { getSurveys } from "./_api/useGetSurvey";
import { cookies } from "next/headers";
import Header from "./_components/Header";
import Form from "./_components/form/Form";
import { OWNER } from "@constants/auth";
import { getLandingBrandById } from "@/app/brand/[brandId]/_api/useGetLandingBrandById";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";

type PageParams = Promise<{ brandId: string }>;

export default async function Page({ params }: { params: PageParams }) {
  const cookieStore = await cookies();
  const owner = cookieStore.get(OWNER)?.value ?? "";

  const { brandId } = await params;
  const surveys = await getSurveys(brandId, owner);
  const brand = await getLandingBrandById(brandId, owner);

  return (
    <>
      <HeaderConfigurator
        config={{
          title: "",
          onBack: true,
          onRefresh: undefined,
        }}
      />
      <div className={styles.container}>
        <Header brand={brand} />
        <Form surveys={surveys} />
      </div>
    </>
  );
}
