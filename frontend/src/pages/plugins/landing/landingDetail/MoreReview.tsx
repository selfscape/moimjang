import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BrandReview } from "api/admin/brand/types/brandReview";
import useHeader from "hooks/landing/components/useHeader";

import BrandingLayout from "components/landing/common/BrandingLayout";
import PhotoReview from "components/landing/productDetail/PhotoReview";
import useGetLandingBrandReviews from "api/landing/hook/useGetLandingBrandReviews";

const getReviews = (reviewList: Array<BrandReview>) => {
  if (!reviewList || !reviewList.length) return;

  return reviewList?.map((review) => ({
    id: review.id,
    userName: review?.user?.username,
    userGender: review?.user?.gender,
    images: review?.imageList?.map((img) => img.url),
    reviewContent: review.contents,
  }));
};

const MoreReview = () => {
  const { header } = useHeader();
  const { brandId } = useParams();
  const { data: brandReviewData } = useGetLandingBrandReviews();
  const reviews = getReviews(brandReviewData?.reviews);
  const navigate = useNavigate();

  useEffect(() => {
    header({
      visible: true,
      title: "리뷰 보기",
      onBack: () => navigate(-1),
    });
  }, []);

  return (
    <BrandingLayout>
      <PhotoReview reviews={reviews} />
    </BrandingLayout>
  );
};

const Container = styled.div``;

export default MoreReview;
