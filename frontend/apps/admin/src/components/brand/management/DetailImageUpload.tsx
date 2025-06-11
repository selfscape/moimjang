import React, { useCallback } from "react";
import styled from "styled-components";

import { uploadDetailImage } from "api/brand/uploadDetailImage";
import { deleteDetailImage } from "api/brand/deleteDetailImage";

import { useBrandFormContext } from "hooks/brand/context/useBrandFormContext";

import ProductImage from "components/common/image/ProductImage";
import AddImageInput from "components/common/image/addImageInput";
import useSystemModal from "hooks/common/components/useSystemModal";
import useOwnerCookie from "hooks/auth/useOwnerCookie";

const DetailImageUpload = () => {
  const { brandId, setBrand, brand } = useBrandFormContext();

  const owner = useOwnerCookie();
  const isTester = owner === "tester";
  const { showAnyMessageModal } = useSystemModal();

  const images =
    brand.detailImages && brand.detailImages.length > 0
      ? brand.detailImages.map((img) => ({ id: img.id, url: img.url }))
      : [{ id: null, url: "" }];

  const handleAddImage = useCallback(() => {
    setBrand((prev) => ({
      ...prev,
      detailImages: [...prev.detailImages, { id: null, url: "" }],
    }));
  }, [setBrand]);

  const handleImageChange = useCallback(
    async (index: number, file: File) => {
      if (isTester) {
        showAnyMessageModal("테스터 계정은 이미지 변경 권한이 없습니다");
        return;
      }

      if (!file) return;
      try {
        const uploadedImage = await uploadDetailImage(file, brandId);

        setBrand((prev) => ({
          ...prev,
          detailImages: prev.detailImages.map((img, i) =>
            i === index ? { id: uploadedImage.id, url: uploadedImage.url } : img
          ),
        }));
      } catch (error) {
        console.error("Image upload failed", error);
      }
    },
    [brandId, setBrand, brand.detailImages]
  );

  const handleDeleteImage = useCallback(
    async (index: number) => {
      if (isTester) {
        showAnyMessageModal("테스터 계정은 브랜드 삭제 권한이 없습니다");
        return;
      }

      const image = images[index];
      if (image.id) {
        try {
          await deleteDetailImage(image.id, Number(brandId));
          setBrand((prev) => ({
            ...prev,
            detailImages: prev.detailImages.filter((_, i) => i !== index),
          }));
        } catch (error) {
          console.error("Detail image deletion failed", error);
        }
      } else {
        setBrand((prev) => ({
          ...prev,
          detailImages: prev.detailImages.filter((_, i) => i !== index),
        }));
      }
    },
    [brandId, setBrand, brand.detailImages]
  );

  return (
    <Container>
      <LabelContainer>
        <Label>상세 페이지</Label>
        <AddCardButton type="button" onClick={handleAddImage}>
          + 이미지 추가
        </AddCardButton>
      </LabelContainer>

      <ImageContainer>
        {images.map((image, index) => (
          <ImageUploadWrapper key={image.id ?? `new-${index}`}>
            {image.url ? (
              <ProductImage
                imageSource={image.url}
                width="300px"
                height="300px"
                handleImageInputChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) => handleImageChange(index, e.target.files![0])}
                handleRemoveButtonClick={() => handleDeleteImage(index)}
              />
            ) : (
              <AddImageInput width="300px" height="300px">
                <HiddenInput
                  id={`file-upload-${index}`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleImageChange(index, e.target.files![0])
                  }
                />
                <DeleteButton
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                >
                  삭제
                </DeleteButton>
              </AddImageInput>
            )}
          </ImageUploadWrapper>
        ))}
      </ImageContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
`;

const AddCardButton = styled.button`
  color: #fff;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  background-color: ${({ theme }) => theme.palette.grey700};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const ImageUploadWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`;

const HiddenInput = styled.input.attrs({
  type: "file",
  accept: "image/*",
})`
  visibility: hidden;
`;

const DeleteButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
`;

export default DetailImageUpload;
