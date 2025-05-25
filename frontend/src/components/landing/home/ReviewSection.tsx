import React from "react";
import styled from "styled-components";

import useGetBrandReviews from "api/admin/brand/hooks/useGetBrandReviews";
import { getReviews } from "utils/landing/brandLanding/normalizeData";
import PhotoReview from "../productDetail/PhotoReview";
import useGetLandingBrandReviews from "api/landing/hook/useGetLandingBrandReviews";

const ReviewSection: React.FC = () => {
  const { data, isError } = useGetLandingBrandReviews();

  const reviews = data?.reviews;
  const photoReviews = getReviews(reviews);

  if (isError || !reviews) {
    return (
      <Container>
        <SectionTitle>모임 후기</SectionTitle>
        <Message>리뷰를 불러오는 데 실패했습니다.</Message>
      </Container>
    );
  }

  return <PhotoReview moreReviewsUrl={""} reviews={photoReviews} />;
};

const Container = styled.div``;

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

  margin: 0 20px;
  margin-bottom: 20px;

  font-family: HurmeGeometricSans3, NotoSansCJKkr, Roboto, Droid Sans,
    Malgun Gothic, Helvetica, Apple-Gothic, 애플고딕, Tahoma, dotum, 돋움, gulim,
    굴림, sans-serif;
`;

const Message = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #666666;
`;

export default ReviewSection;
