import React from "react";
import { Swiper, SwiperProps, SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";

interface CustomSwiperProps extends SwiperProps {
  ref?: React.MutableRefObject<SwiperRef | null>;
}

const CustomSwiper: React.FC<CustomSwiperProps> = ({ children, ...props }) => {
  return (
    <Swiper
      edgeSwipeDetection={true}
      longSwipesRatio={0.1}
      longSwipesMs={0}
      shortSwipes={false}
      {...props}
    >
      {children}
    </Swiper>
  );
};

export default CustomSwiper;
