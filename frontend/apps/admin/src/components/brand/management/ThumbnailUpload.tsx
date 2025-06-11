import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { uploadThumbnailImage } from "api/brand/uploadThumbnailImage";
import { convertFileToBase64 } from "utils/image";
import { useBrandFormContext } from "hooks/brand/context/useBrandFormContext";

import AddImageInput from "components/common/image/addImageInput";
import ProductImage from "components/common/image/ProductImage";
import useSystemModal from "hooks/common/components/useSystemModal";
import useOwnerCookie from "hooks/auth/useOwnerCookie";

const ThumbnailUpload: React.FC = () => {
  const { brandId, setBrand, brand } = useBrandFormContext();
  const { showAnyMessageModal } = useSystemModal();
  const owner = useOwnerCookie();
  const isTester = owner === "tester";

  const [preview, setPreview] = useState<string>(
    brand?.thumbnailImage?.url || ""
  );

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    if (!e.target.files) return;
    const file = e.target.files[0];
    const base64 = await convertFileToBase64(file);
    setPreview(base64);

    try {
      const result = await uploadThumbnailImage(file, brandId);
      setBrand((prev) => ({
        ...prev,
        thumbnailImage: {
          id: result.id,
          url: result.url,
        },
      }));
    } catch (error) {
      console.error("Thumbnail upload failed", error);
    }
  };

  const handleRemove = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    setPreview("");
    setBrand((prev) => ({
      ...prev,
      thumbnailImage: { id: null, url: "" },
    }));
  };

  useEffect(() => {
    setPreview(brand?.thumbnailImage?.url || "");
  }, [brand?.thumbnailImage?.url]);

  const displayImage = preview || brand.thumbnailImage.url;

  return (
    <FieldGroup>
      <Label>대표 이미지</Label>
      <ImageContainer>
        <ImageUploadWrapper>
          <AddImageInput width="300px" height="300px">
            <HiddenInput
              id="file-upload-thumbnail"
              onChange={handleThumbnailUpload}
            />
          </AddImageInput>
        </ImageUploadWrapper>
        {displayImage && (
          <ProductImage
            imageSource={displayImage}
            width="300px"
            height="300px"
            handleImageInputChange={handleThumbnailUpload}
            handleRemoveButtonClick={handleRemove}
          />
        )}
      </ImageContainer>
    </FieldGroup>
  );
};

export default ThumbnailUpload;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
`;
const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
`;
const ImageUploadWrapper = styled.div`
  position: relative;
`;
const HiddenInput = styled.input.attrs({
  type: "file",
  accept: "image/*",
})`
  visibility: hidden;
`;
