import React, { CSSProperties } from "react";
import styled from "styled-components";
import addImageButtonSvg from "assets/icons/addphoto.svg";

interface AddImageInputProps {
  children: React.ReactNode;
  style?: CSSProperties;
  width?: string;
  height?: string;
  backgroundImage?: string;
}

const AddImageInput = ({
  children,
  style,
  width,
  height,
  backgroundImage,
}: AddImageInputProps) => {
  return (
    <AddImageInputWrapper
      width={width}
      height={height}
      backgroundImage={backgroundImage}
      style={style}
    >
      <Label>사진 추가하기</Label>
      {children}
    </AddImageInputWrapper>
  );
};

const AddImageInputWrapper = styled.label<{
  style?: CSSProperties;
  width?: string;
  height?: string;
  backgroundImage?: string;
}>`
  width: ${({ width }) => (width ? width : "140px")};
  height: ${({ height }) => (height ? height : "140px")};

  background-image: url(${addImageButtonSvg});
  background-repeat: no-repeat;
  background-position: 50% 40%;
  border: 2px dashed ${({ theme: { palette } }) => palette.grey500};

  position: absolute;
  top: 0;
  left: 0;

  cursor: pointer;
`;

const Label = styled.span`
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translateX(-50%);

  white-space: nowrap;
  font-family: Spoqa Han Sans Neo;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.1px;
`;

export default React.memo(AddImageInput);
