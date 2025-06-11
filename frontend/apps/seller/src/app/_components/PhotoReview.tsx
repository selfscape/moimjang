"use client";

import React, { useState } from "react";
import styles from "./PhotoReview.module.css";
import { useRouter } from "next/navigation";
import ImageModal from "./ImageModal";
import OptimizedImage from "@ui/components/Image/OptimizedNextImage";

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
  const router = useRouter();
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
    <div className={styles.reviewSection}>
      <h2 className={styles.reviewTitle}>포토 리뷰</h2>
      {displayedReviews?.map((review) => (
        <div className={styles.reviewCard} key={review.id}>
          <div className={styles.imageList}>
            {review.images.slice(0, 3).map((img, idx) => (
              <div
                className={styles.imageWrapper}
                key={idx}
                onClick={() => openModal(review.images, idx)}
              >
                <OptimizedImage
                  className={styles.reviewImage}
                  src={img}
                  alt={`review-${review.id}-img-${idx}`}
                  objectFit={"fill"}
                />
                {review.images.length > 3 && idx === 2 && (
                  <div className={styles.overlay}>
                    +{review.images.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.reviewContent}>
            <p className={styles.reviewText}>{review.reviewContent}</p>
          </div>
        </div>
      ))}

      {moreReviewsUrl && (
        <button
          className={styles.moreReviewsButton}
          onClick={() => router.push(moreReviewsUrl)}
        >
          더 많은 후기 보기
        </button>
      )}

      {modalImages && (
        <ImageModal
          images={modalImages}
          initialSlide={currentSlide}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default PhotoReview;
