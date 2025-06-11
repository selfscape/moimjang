"use client";

import React from "react";
import styles from "./BrandInfo.module.css";
import useGetLandingBrandById from "../_api/useGetLandingBrandById";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";
import { FaMapMarkerAlt, FaUsers, FaClock } from "react-icons/fa";
import ErrorBox from "@ui/components/Error/ErrorBox";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";

interface Props {
  brandId: string;
}

const BrandInfo: React.FC<Props> = ({ brandId }) => {
  const { data, isError, isLoading } = useGetLandingBrandById(brandId);

  if (isError) return <ErrorBox />;
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <>정보가 존재하지 않습니다.</>;

  return (
    <div>
      <OptimizedNextImage
        className={styles.thumbnail}
        src={data?.thumbnailImage?.url}
        alt="Thumbnail"
        width={430}
        height={430}
      />
      <div className={styles.detailSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.brandName}>{data.title}</h1>
          <h1 className={styles.title}>{data.description}</h1>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt size={18} />
            <span className={styles.infoText}>{data.meeting_location}</span>
          </div>
          <div className={styles.infoItem}>
            <FaUsers size={18} />
            <span className={styles.infoText}>
              최대 수용 가능 인원 {data.max_participants}명
            </span>
          </div>
          <div className={styles.infoItem}>
            <FaClock size={18} />
            <span className={styles.infoText}>
              진행 시간 {data.socialing_duration}시간
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandInfo;
