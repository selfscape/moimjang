import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useUpdateBrandReview from "api/admin/brand/hooks/useUpdateBrandReview";
import useCreateBrandReview from "api/admin/brand/hooks/useCreateBrandReview";
import { Pathnames } from "constants/admin";
import useSystemModal from "hooks/common/components/useSystemModal";
import useHeader from "hooks/consumer/components/useHeader";
import userState from "recoils/atoms/auth/userState";
import { uploadBrandReviewImage } from "api/consumer/socialing/uploadBrandReviewImage";

import ConsumerLayout from "components/consumer/common/ConsumerLayout";
import { BrandReview } from "api/admin/brand/types/brandReview";

const MAX_IMAGES = 6;

const WriteReview = () => {
  const location = useLocation();
  const { channelId } = useParams();
  const { state: brandId } = location;
  const navigate = useNavigate();
  const { header } = useHeader();
  const { openModal, closeModal, showErrorModal } = useSystemModal();
  const { mutate: updateBrandReview } = useUpdateBrandReview();
  const { mutate: createBrandReview } = useCreateBrandReview();
  const [userData, _] = useRecoilState(userState);

  const [images, setImages] = useState<File[]>([]);
  const [review, setReview] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);

    if (images.length + fileArray.length <= MAX_IMAGES) {
      setImages([...images, ...fileArray]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  const handleSubmit = () => {
    createBrandReview(
      {
        user_id: userData?.id,
        brand_id: brandId,
      },
      {
        onSuccess: (data: BrandReview) => {
          const brandReviewId = data.id;

          Promise.all(
            images.map((img) => uploadBrandReviewImage(img, brandReviewId))
          )
            .then(() => {
              updateBrandReview(
                {
                  review_id: brandReviewId,
                  requestBody: {
                    contents: review,
                    is_display: true,
                  },
                },
                {
                  onSuccess: () => {
                    openModal({
                      isOpen: true,
                      confirmText: "확인",
                      showCancel: false,
                      title: "리뷰 작성 완료",
                      message: "리뷰 작성이 완료되었습니다. 감사합니다.😊",
                      onConfirm: () => {
                        closeModal();
                        navigate(`${Pathnames.ChannelDetail}/${channelId}`);
                      },
                    });
                  },
                  onError: (error) => {
                    showErrorModal(error.message);
                  },
                }
              );
            })
            .catch((error) => {
              showErrorModal(error.message);
            });
        },
        onError: (error) => {
          showErrorModal(error?.message);
        },
      }
    );
  };

  useEffect(() => {
    header({
      visible: true,
      title: "후기 작성하기",
      onBack: handleBackButtonClick,
    });
  }, [header, handleBackButtonClick]);

  return (
    <ConsumerLayout>
      <Container>
        <Title>호스트에 대한 리뷰를 남겨주세요</Title>
        <SubText>남겨주신 리뷰는 호스트에게 큰 도움이 돼요.</SubText>

        <ImageWrapper>
          {images.map((img, idx) => (
            <ImageItem key={idx}>
              <ImagePreview src={URL.createObjectURL(img)} />
              <DeleteButton onClick={() => handleDeleteImage(idx)}>
                ×
              </DeleteButton>
            </ImageItem>
          ))}
          {images.length < MAX_IMAGES && (
            <ImageInputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
              <span>+</span>
              <p>
                {images.length}/{MAX_IMAGES}
              </p>
            </ImageInputLabel>
          )}
        </ImageWrapper>

        <ReviewTextarea
          placeholder="리뷰를 입력해 주세요 (최소 5글자)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <SubmitButton onClick={handleSubmit} disabled={review.length < 5}>
          제출하기
        </SubmitButton>
      </Container>
    </ConsumerLayout>
  );
};

export default WriteReview;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const SubText = styled.p`
  color: gray;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

const ImageItem = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 0px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  cursor: pointer;
`;

const ImageInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  width: 100px;
  height: 100px;
  input {
    display: none;
  }
  span {
    font-size: 24px;
    color: #aaa;
  }
  p {
    font-size: 12px;
    color: #aaa;
  }
`;
const ReviewTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  resize: none;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  background-color: ${(props) => (props.disabled ? "#e0e0e0" : "black")};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: 0.3s all;
`;
