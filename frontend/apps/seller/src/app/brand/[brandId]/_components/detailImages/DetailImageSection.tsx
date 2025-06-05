import React from "react";
import styles from "./DetailImages.module.css";
import { GET_LANDING_BRAND_BY_ID } from "@/constant/barnd/queryKey";
import { QueryClient } from "@tanstack/react-query";
import { Brand } from "@model/brand";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";

interface Props {
  brandId: string;
  queryClient: QueryClient;
  owner: string;
}

export default function DetailImageSection({
  brandId,
  queryClient,
  owner,
}: Props) {
  const data = queryClient.getQueryData<Brand>([
    GET_LANDING_BRAND_BY_ID,
    brandId,
    owner,
  ]);

  const detailImages = data?.detailImages;
  if (!detailImages?.length) return <></>;

  return (
    <div className={styles.container}>
      {detailImages.map(({ url, id }) => (
        <OptimizedNextImage
          key={id}
          src={url}
          alt={`$Detail-image-${id}`}
          className={styles.img}
        />
      ))}
    </div>
  );
}
