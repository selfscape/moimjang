"use client";

import { useRouter } from "next/navigation";
import { BrandState } from "@model/brand";
import styles from "./BrandSection.module.css";
import useGetLandingBrands from "../../_api/useGetLandingBrands";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";
import ErrorBox from "@ui/components/Error/ErrorBox";
import OptimizedImage from "@ui/components/Image/OptimizedNextImage";

export default function BrandCardList() {
  const router = useRouter();

  const handleBrandButtonClick = (brandId: number) => {
    router.push(`/brand/${brandId}`);
  };

  const { data, isError, isLoading } = useGetLandingBrands({
    state: BrandState.ONGOING,
    sort_by: "id",
    descending: true,
    offset: 0,
    limit: 10,
  });

  const brands = data?.brands || [];

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBox />;

  return brands.map((brand) => (
    <div
      key={brand.id}
      className={styles.brandCardWrapper}
      onClick={() => handleBrandButtonClick(brand.id)}
    >
      <OptimizedImage
        className={styles.brandImage}
        src={brand.thumbnailImage?.url}
        alt={brand.title}
      />
      <div className={styles.cardOverlay}>
        <button className={styles.detailButton}>자세히 보기</button>
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{brand.title}</h3>
        <p className={styles.cardDescription}>{brand.description}</p>
      </div>
    </div>
  ));
}
