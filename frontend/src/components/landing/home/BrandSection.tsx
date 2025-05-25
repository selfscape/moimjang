import { Pathnames } from "constants/admin";
import { useNavigate } from "react-router-dom";

import useGetLandingBrands from "api/landing/hook/useGetLandingBrands";
import { BrandState } from "interfaces/brand";
import { LandingBrand } from "api/landing/type/landingBrand";
import styles from "./BrandSection.module.css";

const BrandSection = () => {
  const navigate = useNavigate();

  const handleBrandButtonClick = (brandId: number) => {
    navigate(`${Pathnames.LandingProduct}/${brandId}`);
  };

  const { data } = useGetLandingBrands({
    state: BrandState.ONGOING,
    sort_by: null,
    descending: true,
    offset: 0,
    limit: 10,
  });

  const brands = data?.brands;

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>진행중인 모임</h2>
      <div className={styles.cardContainer}>
        {brands
          ?.filter((b) => b.brand_state === BrandState.ONGOING)
          .map((brand: LandingBrand) => (
            <div
              key={brand.id}
              className={styles.brandCardWrapper}
              onClick={() => handleBrandButtonClick(brand.id)}
            >
              <img
                className={styles.brandImage}
                src={brand?.thumbnailImage?.url}
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
          ))}
      </div>
    </div>
  );
};

export default BrandSection;
