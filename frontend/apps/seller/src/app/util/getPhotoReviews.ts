import { BrandReview } from "@model/review";

export const getPhotoReviews = (brandReviewData: Array<BrandReview>) => {
  if (!brandReviewData) return [];
  return brandReviewData
    .filter((review) => review.imageList && review.imageList.length > 0)
    .map((review) => ({
      id: review.id,
      userName: review?.user?.username,
      userGender: review?.user?.gender,
      images: review.imageList.map((img) => img.url),
      reviewContent: review.contents,
    }));
};
