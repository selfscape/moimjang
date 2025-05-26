import { Pathnames } from "constants/admin";
import { useNavigate } from "react-router-dom";

import useGetLandingBrands from "api/landing/hook/useGetLandingBrands";
import { BrandState } from "interfaces/brand";
import { LandingBrand } from "api/landing/type/landingBrand";
import styled from "styled-components";

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
    <Container>
      <SectionTitle>진행중인 모임</SectionTitle>
      <CardContainer>
        {brands
          ?.filter((b) => b.brand_state === BrandState.ONGOING)
          .map((brand: LandingBrand) => (
            <BrandCardWrapper
              key={brand.id}
              onClick={() => handleBrandButtonClick(brand.id)}
            >
              <BrandImage src={brand?.thumbnailImage?.url} alt={brand.title} />
              <CardOverlay>
                <DetailButton>자세히 보기</DetailButton>
              </CardOverlay>
              <CardInfo>
                <CardTitle>{brand.title}</CardTitle>
                <CardDescription>{brand.description}</CardDescription>
              </CardInfo>
            </BrandCardWrapper>
          ))}
      </CardContainer>
    </Container>
  );
};

const Container = styled.div``;

const CardOverlay = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -150%);
  opacity: 1;
  pointer-events: auto;
`;

const BrandCardWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0px 20px;
  cursor: pointer;
  border-radius: 24px;
`;

const DetailButton = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const SectionTitle = styled.h2`
  display: flex;
  justify-content: center;
  height: 42px;
  padding: 0 35px;
  border: 1.5px solid #111;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 700;
  line-height: 40px;
  margin: 0 20px 20px;
  font-family: HurmeGeometricSans3, NotoSansCJKkr, Roboto, Droid Sans,
    Malgun Gothic, Helvetica, Apple-Gothic, 애플고딕, Tahoma, dotum, 돋움, gulim,
    굴림, sans-serif;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const BrandImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
`;

const CardInfo = styled.div`
  padding: 16px;
  text-align: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #666;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;

export default BrandSection;
