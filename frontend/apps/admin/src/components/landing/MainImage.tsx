import React from "react";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import useUploadMainImage from "api/landing/hooks/useUploadMainImage";
import useDeleteMainImage from "api/landing/hooks/useDeleteMainImage";
import useGetMainImage from "api/landing/hooks/useGetMainImage";
import { GET_MAIN_IMAGE } from "constants/queryKeys";
import useSystemModal from "hooks/common/components/useSystemModal";

import AddImageInput from "components/common/image/addImageInput";
import ProductImage from "../common/image/ProductImage";
import useOwnerCookie from "hooks/auth/useOwnerCookie";

const MainImage = () => {
  const { mutate: uploadMainImage } = useUploadMainImage();
  const { mutate: deleteMainImgae } = useDeleteMainImage();
  const queryClient = useQueryClient();
  const { data } = useGetMainImage();
  const { showErrorModal, showAnyMessageModal } = useSystemModal();

  const owner = useOwnerCookie();
  const isTester = owner === "tester";

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    if (!e.target.files) return;
    const file = e.target.files[0];

    uploadMainImage(file, {
      onSuccess: (data) => {
        queryClient.setQueryData([GET_MAIN_IMAGE], data);
      },
      onError: () => {
        showErrorModal("이미지 업로드를 실패했습니다.");
      },
    });
  };

  const handleRemove = async () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    deleteMainImgae(null, {
      onSuccess: () => {
        queryClient.setQueryData([GET_MAIN_IMAGE], { id: null, url: "" });
      },
      onError: () => {
        showErrorModal("이미지 삭제를 실패했습니다.");
      },
    });
  };

  return (
    <Container>
      <Label>대표 이미지</Label>
      <ImageContainer>
        <ImageUploadWrapper>
          <AddImageInput width="300px" height="300px">
            <HiddenInput
              id="file-upload-MainImage"
              onChange={handleMainImageUpload}
            />
          </AddImageInput>
        </ImageUploadWrapper>

        {data?.url && (
          <ProductImage
            imageSource={data?.url}
            width="300px"
            height="300px"
            handleImageInputChange={handleMainImageUpload}
            handleRemoveButtonClick={handleRemove}
          />
        )}
      </ImageContainer>
    </Container>
  );
};

const Container = styled.div`
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

export default MainImage;
