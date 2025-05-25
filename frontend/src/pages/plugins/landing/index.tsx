import { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useHeader from "hooks/landing/components/useHeader";

import BrandingLayout from "components/landing/common/BrandingLayout";
import HeroSection from "components/landing/home/HeroSection";
import BrandSection from "components/landing/home/BrandSection";
import ReviewSection from "components/landing/home/ReviewSection";
import GallerySection from "components/landing/home/GallerySection";

const AnimatedSection = ({ children, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

const Branding = () => {
  const { header } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    header({
      visible: false,
      title: "메인 페이지",
      onBack: () => navigate(-1),
    });
  }, []);

  return (
    <BrandingLayout>
      <PageContainer>
        <HeroSection />

        <AnimatedSection as={BrandRef}>
          <BrandSection />
        </AnimatedSection>

        <AnimatedSection as={ReviewRef}>
          <ReviewSection />
        </AnimatedSection>

        <AnimatedSection as={GalleryRef}>
          <GallerySection />
        </AnimatedSection>
      </PageContainer>
    </BrandingLayout>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;

  font-family: "SUIT", sans-serif;

  background-color: #fff;
  padding-bottom: 00px;
`;

const BrandRef = styled.section``;
const ReviewRef = styled.section``;
const GalleryRef = styled.section``;

export default Branding;
