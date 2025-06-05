"use client";

import React from "react";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import Swiper from "./Swiper";
import styles from "./SwiperSlide.module.css";
import OptimizedNextImage from "../Image/OptimizedNextImage";

interface CarouselProps {
  imageList: { id: number; thumbnail: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ imageList }) => {
  return (
    <div className={styles.container}>
      <Swiper
        grabCursor={true}
        loop={true}
        className="mySwiper"
        modules={[Pagination]}
        pagination={{ dynamicBullets: true }}
      >
        <div className={styles.imageList}>
          {imageList.map(({ id, thumbnail }) => (
            <div className={styles.imageWrapper} key={id}>
              <SwiperSlide key={id}>
                <OptimizedNextImage
                  src={thumbnail}
                  alt="컨텐츠 카드"
                  className={styles.image}
                />
              </SwiperSlide>
            </div>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default Carousel;
