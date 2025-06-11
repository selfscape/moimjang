"use client";

import React from "react";
import { ChannelState } from "@model/channel";

import useGetChannelList from "../_api/useGetChannelList";
import ErrorBox from "@ui/components/Error/ErrorBox";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";
import { USER_NAME } from "@constants/auth";
import useCookie from "@util/hooks/useCookie";
import HasNoSocialing from "./HasNoSocialing";
import Event from "./Event";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import styles from "./SocialingEvents.module.css";

export default function SocialingEvents() {
  const owner = useCookie(OWNER);

  const { data, isLoading, isError, refetch } = useGetChannelList(
    {
      state: ChannelState.ONGOING,
      descending: false,
      sort_by: "id",
      limit: 20,
      offset: 0,
    },
    owner
  );

  const channels = data?.channels;

  if (!channels?.length) return <HasNoSocialing />;
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBox />;

  return (
    <>
      <HeaderConfigurator
        config={{
          title: "홈",
          onBack: false,
          onRefresh: refetch,
        }}
      />
      <div className={styles.container}>
        {channels.map((socialing) => (
          <Event socialing={socialing} key={socialing.id} />
        ))}
      </div>
    </>
  );
}
