import React from "react";
import styles from "./page.module.css";
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getLandingChannels } from "./_api/useGetLandingChannels";
import { getLandingBrandById } from "./_api/useGetLandingBrandById";
import { GET_LANDING_CHANNELS } from "@/app/_constant/channel/queryKey";
import { GET_LANDING_BRAND_BY_ID } from "@/app/_constant/barnd/queryKey";
import { ChannelState } from "@model/channel";
import BrandInfo from "./_components/BrandInfo";
import DetailImageSection from "./_components/detailImages/DetailImageSection";
import ScheduleContainer from "./_components/schedule/ScheduleContainer";
import HeaderConfigurator from "@ui/components/Header/HeaderConfigurator";
import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import { OWNER } from "@constants/auth";

type PageParams = Promise<{ brandId: string }>;

export default async function Page({ params }: { params: PageParams }) {
  const cookieStore = await cookies();
  const owner = cookieStore.get(OWNER)?.value ?? "";

  const { brandId } = await params;

  if (!brandId) return <></>;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [GET_LANDING_BRAND_BY_ID, brandId, owner],
    queryFn: () => getLandingBrandById(brandId, owner),
  });

  await queryClient.prefetchQuery({
    queryKey: [GET_LANDING_CHANNELS, brandId, owner],
    queryFn: () =>
      getLandingChannels(
        {
          brand_id: brandId,
          state: ChannelState.ONGOING,
          sort_by: "id",
          descending: true,
        },
        owner
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <OwnerCookieSetter />

      <HeaderConfigurator
        config={{
          title: "",
          onBack: true,
          onRefresh: undefined,
        }}
      />
      <div className={styles.container}>
        <HydrationBoundary state={dehydratedState}>
          <BrandInfo brandId={brandId} />
        </HydrationBoundary>

        <HydrationBoundary state={dehydratedState}>
          <ScheduleContainer brandId={brandId} />
        </HydrationBoundary>

        <HydrationBoundary state={dehydratedState}>
          <DetailImageSection
            brandId={brandId}
            queryClient={queryClient}
            owner={owner}
          />
        </HydrationBoundary>
      </div>
    </>
  );
}
