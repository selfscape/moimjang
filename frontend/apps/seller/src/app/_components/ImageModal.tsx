import React from "react";
import { createPortal } from "react-dom";
import styles from "./ImageModal.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OptimizedNextImage from "@ui/components/Image/OptimizedNextImage";

interface ImageModalProps {
  images: string[];
  initialSlide: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = (props) => {
  const { images, initialSlide, onClose } = props;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        {images.length === 1 ? (
          <OptimizedNextImage
            className={styles.modalImage}
            src={images[0]}
            alt="Enlarged view"
          />
        ) : (
          <div className={styles.modalSwiperWrapper}>
            <Swiper
              initialSlide={initialSlide}
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              style={{ width: "100%", height: "100%" }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <OptimizedNextImage
                    className={styles.modalImage}
                    src={image}
                    alt={`Enlarged view ${index}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
