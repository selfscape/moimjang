import styled from "styled-components";
import useGetMainImage from "api/landing/hook/useGetMainImage";

const HeroSection = () => {
  const { data } = useGetMainImage();

  return (
    <HeroContainer>
      <img src={data?.url} />
    </HeroContainer>
  );
};

const HeroContainer = styled.section`
  max-width: 100%;
  height: 100%;

  img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
`;

export default HeroSection;
