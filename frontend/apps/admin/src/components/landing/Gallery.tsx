import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

import useGetGalleryImages from "api/landing/hooks/useGetGalleryImages";
import useUploadGalleryImage from "api/landing/hooks/useUploadGalleryImage";
import useDeleteGalleryImage from "api/landing/hooks/useDeleteGalleryImage";
import useSystemModal from "hooks/common/components/useSystemModal";

import ProductImage from "components/common/image/ProductImage";
import AddImageInput from "components/common/image/addImageInput";
import { USER_NAME } from "configs";

type GalleryImage = { id?: number; url: string };
const emptyImage: GalleryImage = { id: null, url: "" };

const Gallery = () => {
  const { data } = useGetGalleryImages();
  const { mutate: uploadGalleryImage } = useUploadGalleryImage();
  const { mutate: deleteGalleryImage } = useDeleteGalleryImage();

  const owner = localStorage.getItem(USER_NAME);
  const isTester = owner === "tester";

  const { showErrorModal, showAnyMessageModal } = useSystemModal();
  const [images, setImages] = useState<GalleryImage[]>([emptyImage]);

  const handleAddImage = useCallback(() => {
    setImages((prev) => (prev.length < 20 ? [...prev, emptyImage] : prev));
  }, []);

  const handleImageChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isTester) {
        showAnyMessageModal("테스터 계정은 권한이 없습니다");
        return;
      }

      const file = e.target.files?.[0];
      if (!file) return;
      uploadGalleryImage(file, {
        onSuccess: ({ id, url }) => {
          setImages((prev) => {
            const next = [...prev];
            next[index] = { id, url };
            return next;
          });
        },
        onError: () => {
          showErrorModal("이미지 업로드에 실패했습니다.");
        },
      });
    },
    [uploadGalleryImage, showErrorModal]
  );

  const handleDeleteImage = useCallback(
    (index: number) => {
      if (isTester) {
        showAnyMessageModal("테스터 계정은 권한이 없습니다");
        return;
      }

      const image = images[index];
      if (!image.id) {
        setImages((prev) => prev.filter((_, i) => i !== index));
        return;
      }
      deleteGalleryImage(image.id, {
        onSuccess: () => {
          setImages((prev) => prev.filter((_, i) => i !== index));
        },
        onError: () => {
          showErrorModal("이미지 삭제를 실패했습니다.");
        },
      });
    },
    [images, deleteGalleryImage, showErrorModal]
  );

  useEffect(() => {
    setImages(
      data && data.length > 0
        ? data.map((img) => ({ id: img.id, url: img.url }))
        : [emptyImage]
    );
  }, [data]);

  return (
    <Container>
      <LabelContainer>
        <Label>갤러리 이미지</Label>
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
                handleImageInputChange={handleImageChange(index)}
                handleRemoveButtonClick={() => handleDeleteImage(index)}
              />
            ) : (
              <AddImageInput width="300px" height="300px">
                <HiddenInput
                  id={`file-upload-${index}`}
                  onChange={handleImageChange(index)}
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

export default Gallery;
