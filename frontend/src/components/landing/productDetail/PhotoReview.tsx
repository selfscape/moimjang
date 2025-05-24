import React, { useState } from "react";
import styled from "styled-components";
import ImageModal from "../common/ImageModal";
import { useNavigate } from "react-router-dom";

export interface Review {
  id: number;
  userName: string;
  userGender: string;
  images: string[];
  reviewContent: string;
}

interface PhotoReviewProps {
  reviews: Review[];
  moreReviewsUrl?: string;
}

const PhotoReview: React.FC<PhotoReviewProps> = ({
  reviews,
  moreReviewsUrl,
}) => {
  const navigate = useNavigate();
  const [modalImages, setModalImages] = useState<string[] | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const openModal = (images: string[], index: number) => {
    setModalImages(images);
    setCurrentSlide(index);
  };

  const closeModal = () => {
    setModalImages(null);
    setCurrentSlide(0);
  };

  const displayedReviews = moreReviewsUrl ? reviews.slice(0, 3) : reviews;

  return (
    <ReviewSection>
      <ReviewTitle>포토 리뷰</ReviewTitle>
      {displayedReviews?.map((review) => (
        <ReviewCard key={review.id}>
          <ImageList>
            {review.images.slice(0, 3).map((img, idx) => (
              <ImageWrapper
                key={idx}
                onClick={() => openModal(review.images, idx)}
              >
                <ReviewImage src={img} alt={`review-${review.id}-img-${idx}`} />
                {review.images.length > 3 && idx === 2 && (
                  <Overlay>+{review.images.length - 3}</Overlay>
                )}
              </ImageWrapper>
            ))}
          </ImageList>

          <ReviewContent>
            <ReviewText>{review.reviewContent}</ReviewText>
          </ReviewContent>
        </ReviewCard>
      ))}

      {moreReviewsUrl && (
        <MoreReviewsButton onClick={() => navigate(moreReviewsUrl)}>
          더 많은 후기 보기
        </MoreReviewsButton>
      )}

      {modalImages && (
        <ImageModal
          images={modalImages}
          initialSlide={currentSlide}
          onClose={closeModal}
        />
      )}
    </ReviewSection>
  );
};

export default PhotoReview;

const ReviewSection = styled.div`
  margin: 12px 0;
  padding: 20px;
  background-color: #fff;
`;

const ReviewTitle = styled.h2`
  margin-bottom: 16px;
  font-size: 1.125rem;
`;

const ReviewCard = styled.div`
  background-color: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const ImageWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const ReviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReviewText = styled.p`
  font-size: 0.875rem;
  line-height: 1.4;
  color: #555;
`;

const MoreReviewsButton = styled.button`
  display: block;
  margin: 0 auto;

  width: 100%;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: #111;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #111;
  }
`;
