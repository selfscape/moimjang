import OwnerCookieSetter from "@util/hooks/OwnerCookieSetter";
import AnimatedSection from "./_components/AnimatedSection";
import BrandSection from "./_components/landingBrand/BrandSection";
import GallerySection from "./_components/landingBrand/GallerySection";
import MainSection from "./_components/landingBrand/MainImageSection";
import ReviewSection from "./_components/landingBrand/ReviewSection";

export default function Home() {
  return (
    <main>
      <OwnerCookieSetter />

      <AnimatedSection>
        <MainSection />
      </AnimatedSection>

      <AnimatedSection>
        <BrandSection />
      </AnimatedSection>

      <AnimatedSection>
        <ReviewSection />
      </AnimatedSection>

      <AnimatedSection>
        <GallerySection />
      </AnimatedSection>
    </main>
  );
}
