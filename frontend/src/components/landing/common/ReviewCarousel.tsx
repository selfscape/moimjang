import styled from "styled-components";
import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

interface CarouselItem {
  id: number;
  thumbnail?: string;
  description: string;
}

interface CarouselProps {
  imageList: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ imageList }) => {
  return (
    <Container>
      <Swiper
        grabCursor={true}
        loop={true}
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {imageList?.map(({ id, thumbnail, description }) => (
          <SwiperSlide key={id}>
            <Card>
              {thumbnail ? (
                <CardImage src={thumbnail} alt="Review Image" />
              ) : null}
              <CardDescription>{description}</CardDescription>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;

  .mySwiper {
    padding-bottom: 48px;
  }

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

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 124px;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const CardImage = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const CardDescription = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  text-align: center;
  padding: 0 5px;
`;

export default Carousel;
