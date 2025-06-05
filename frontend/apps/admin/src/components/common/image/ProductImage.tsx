import React from "react";
import styled from "styled-components";
import changeImageIconSrc from "assets/icons/changeImage.svg";
import removeImageIconSrc from "assets/icons/removeImage.svg";

import OptimizedImage from "components/common/image/OptimizedImage";

interface ProductImageProps {
  imageSource: string;
  handleRemoveButtonClick?: () => void;
  handleImageInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string; // e.g. "300px"
  height?: string; // e.g. "300px"
}

const ProductImage = ({
  imageSource,
  handleRemoveButtonClick,
  handleImageInputChange,
  width = "140px",
  height = "140px",
}: ProductImageProps) => {
  // string 값에서 숫자만 추출
  const numericWidth = parseInt(width, 10);
  const numericHeight = parseInt(height, 10);

  return (
    <Container width={width} height={height}>
      <OptimizedImage
        src={imageSource}
        width={numericWidth}
        height={numericHeight}
        mode="fit"
        alt="상품 이미지"
      />

      <RemoveImageButton
        src={removeImageIconSrc}
        onClick={handleRemoveButtonClick}
      />

      <ChangeImageButtonWrapper backgroundImageSource={changeImageIconSrc}>
        <ChangeImageButton onChange={handleImageInputChange} />
      </ChangeImageButtonWrapper>
    </Container>
  );
};

const Container = styled.div<{
  width: string;
  height: string;
}>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: ${({ theme }) => theme.palette.grey300};
`;

const ChangeImageButtonWrapper = styled.label<{
  backgroundImageSource: string;
}>`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  background-image: ${({ backgroundImageSource }) =>
    `url("${backgroundImageSource}")`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
`;

const ChangeImageButton = styled.input.attrs({
  type: "file",
  accept: "image/jpg,image/png,image/jpeg",
})`
  display: none;
`;

const RemoveImageButton = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  user-select: none;
`;

export default React.memo(ProductImage);
