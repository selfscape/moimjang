import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ImageModalProps {
  images: string[];
  initialSlide: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = (props) => {
  const { images, initialSlide, onClose } = props;
  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        {images.length === 1 ? (
          <ModalImage src={images[0]} alt="Enlarged view" />
        ) : (
          <ModalSwiperWrapper>
            <Swiper
              initialSlide={initialSlide}
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              style={{ width: "100%", height: "100%" }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <ModalImage src={image} alt={`Enlarged view ${index}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </ModalSwiperWrapper>
        )}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default ImageModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: #fff;
  max-width: 340px;
  max-height: 340px;

  border-radius: 8px;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 14px;

  width: 32px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  background: none;
  border: none;

  font-size: 24px;
  color: #fff;
  background-color: #111;

  cursor: pointer;
  z-index: 1100;
`;

const ModalImage = styled.img`
  display: block;
  max-width: 340px;
  max-height: 340px;
  margin: 0 auto;

  object-fit: contain;
`;

const ModalSwiperWrapper = styled.div`
  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    margin: 0 6px !important;
    opacity: 1;
    transition: background-color 0.3s;
  }

  .swiper-pagination-bullet-active {
    background-color: #0070f3;
  }

  .swiper-button-prev,
  .swiper-button-next {
    background-color: #fff;

    border-radius: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    color: #000;
    font-size: 16px;
  }
`;
