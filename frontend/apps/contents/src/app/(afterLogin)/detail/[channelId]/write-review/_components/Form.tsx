"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Form.module.css";
import useUpdateBrandReview from "../_api/useUpdateBrandReview";
import useCreateBrandReview from "../_api/useCreateBrandReview";
import useCookie from "@util/hooks/useCookie";
import { OWNER } from "@constants/auth";

import { useSystemModalStore } from "@ui/store/useSystemModalStore";
import { uploadBrandReviewImage } from "../_api/uploadBrandReviewImage";
import { useParams } from "next/navigation";
import pathnames from "@/app/_constant/pathnames";
import { USER_DATA } from "@/app/_constant/auth";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";

const MAX_IMAGES = 6;

export default function Form() {
  const { channelId } = useParams();
  const brandId = useSearchParams().get("brandId");
  const router = useRouter();
  const owner = useCookie(OWNER);
  const user = JSON.parse(localStorage.getItem(USER_DATA) || "");

  const { open, close, showErrorModal } = useSystemModalStore();
  const { mutate: updateBrandReview } = useUpdateBrandReview(owner);
  const { mutate: createBrandReview } = useCreateBrandReview(owner);

  const [images, setImages] = useState<File[]>([]);
  const [review, setReview] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);
    if (images.length + fileArray.length <= MAX_IMAGES) {
      setImages((prev) => [...prev, ...fileArray]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    createBrandReview(
      { requestBody: { user_id: user?.id, brand_id: brandId } },
      {
        onSuccess: (data) => {
          const brandReviewId = data.id;
          Promise.all(
            images.map((img) => uploadBrandReviewImage(img, brandReviewId))
          )
            .then(() => {
              updateBrandReview(
                {
                  review_id: brandReviewId,
                  requestBody: { contents: review, is_display: true },
                },
                {
                  onSuccess: () => {
                    open({
                      isOpen: true,
                      confirmText: "확인",
                      showCancel: false,
                      title: "리뷰 작성 완료",
                      message: "리뷰 작성이 완료되었습니다. 감사합니다.😊",
                      onConfirm: () => {
                        close();
                        router.push(`${pathnames.detail}/${channelId}`);
                      },
                    });
                  },
                  onError: (error) => showErrorModal(error.message),
                }
              );
            })
            .catch((error) => showErrorModal(error.message));
        },
        onError: (error) => showErrorModal(error.message),
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>호스트에 대한 리뷰를 남겨주세요</h2>
        <p className={styles.subText}>
          남겨주신 리뷰는 호스트에게 큰 도움이 돼요.
        </p>

        <div className={styles.imageWrapper}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageItem}>
              <OptimizedNextImage
                src={URL.createObjectURL(img)}
                className={styles.imagePreview}
                alt="리뷰이미지"
              />
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteImage(idx)}
              >
                ×
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className={styles.imageInputLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
              <span className={styles.plus}>+</span>
              <p className={styles.count}>
                {images.length}/{MAX_IMAGES}
              </p>
            </label>
          )}
        </div>

        <textarea
          className={styles.reviewTextarea}
          placeholder="리뷰를 입력해 주세요 (최소 5글자)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          className={styles.submitButton}
          disabled={review.length < 5}
          onClick={handleSubmit}
        >
          제출하기
        </button>
      </div>
    </div>
  );
}
