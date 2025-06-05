"use client";
import React from "react";
import { useParams } from "next/navigation";
import styles from "./ChannelInfo.module.css";
import Thumbnail from "./Thumbnail";
import ActionButtons from "./ActionButtons";
import Details from "./Details";
import useCookie from "@util/hooks/useCookie";
import { OWNER } from "@constants/auth";
import useGetChannelById from "../_api/useGetChannelById";
import ErrorBox from "@ui/components/Error/ErrorBox";
import LoadingSpinner from "react-spinners/FadeLoader";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";

export default function ChannelInfo() {
  const { channelId } = useParams();
  const owner = useCookie(OWNER);
  const { data, isError, isLoading, refetch } = useGetChannelById(
    channelId,
    owner
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBox />;
  if (!data) return <div>데이터가 존재하지 않습니다</div>;

  return (
    <>
      <HeaderConfigurator
        config={{
          title: "채널 상세",
          onBack: true,
          onRefresh: refetch,
        }}
      />
      <div className={styles.cardContainer}>
        <Thumbnail owner={owner} brandId={data?.brand_id} />
        <ActionButtons
          visible_components={data?.visible_components}
          channelId={channelId}
          brandId={data?.brand_id}
        />
        <Details title={data.title} description={data.description} />
      </div>
    </>
  );
}
