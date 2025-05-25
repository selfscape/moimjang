import styled from "styled-components";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import CustomSwiper from "./CustomSwiper";
import { Pagination } from "swiper/modules";

import "swiper/css/pagination";

interface CarouselProps {
  imageList: { id: number; thumbnail: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ imageList }) => {
  return (
    <>
      <Container>
        <CustomSwiper
          grabCursor={true}
          loop={true}
          className="mySwiper"
          modules={[Pagination]}
          pagination={{
            dynamicBullets: true,
          }}
        >
          <ImageList>
            {imageList?.map(({ id, thumbnail }) => {
              return (
                <ImageWrapper key={id}>
                  <SwiperSlide>
                    <Image src={thumbnail} />
                  </SwiperSlide>
                </ImageWrapper>
              );
            })}
          </ImageList>
        </CustomSwiper>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;

  .swiper-pagination-bullet {
    background-color: rgba(0, 0, 0, 0.3);
    width: 10px;
    height: 10px;
    margin: 0 4px !important;
    opacity: 1;
    transition: background-color 0.3s;
  }

  .swiper-pagination-bullet-active {
    background-color: #333;
  }
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
`;

const ImageList = styled.div`
  display: flex;

  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;

  width: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  min-width: 100%;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export default Carousel;
