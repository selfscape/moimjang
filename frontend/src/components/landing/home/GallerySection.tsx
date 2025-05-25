import styled, { keyframes } from "styled-components";

import useGetGalleryImages from "api/landing/hook/useGetGalleryImages";

const GallerySection = () => {
  const { data } = useGetGalleryImages();

  const imageUrls = data?.map((img) => img.url) ?? [];
  const chunkSize = 4;
  const chunks: string[][] = [];
  for (let i = 0; i < imageUrls.length; i += chunkSize) {
    chunks.push(imageUrls.slice(i, i + chunkSize));
  }
  const trackComponents = [
    GalleryTrackFast,
    GalleryTrackMedium,
    GalleryTrackSlow,
  ];

  return (
    <Container>
      <SectionTitle>갤러리</SectionTitle>

      {chunks.map((chunk, idx) => {
        const Track = trackComponents[idx] || GalleryTrack;
        return (
          <AutoScrollGallery
            key={idx}
            style={{
              marginBottom: idx < chunks.length - 1 ? "16px" : undefined,
            }}
          >
            <Track>
              {[...chunk, ...chunk].map((url, index) => (
                <GalleryItem
                  key={`${url}-${index}`}
                  src={url}
                  alt={`갤러리 이미지 ${(index % chunkSize) + 1}`}
                />
              ))}
            </Track>
          </AutoScrollGallery>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 100px;
`;

const SectionTitle = styled.h2`
  display: flex;
  justify-content: center;

  height: 42px;
  padding: 0 35px;
  border: 1.5px solid #111;
  border-radius: 30px;

  font-size: 16px;
  font-weight: 700;
  line-height: 40px;

  margin: 0 20px;
  margin-bottom: 20px;

  font-family: HurmeGeometricSans3, NotoSansCJKkr, Roboto, Droid Sans,
    Malgun Gothic, Helvetica, Apple-Gothic, 애플고딕, Tahoma, dotum, 돋움, gulim,
    굴림, sans-serif;
`;

const scrollAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const AutoScrollGallery = styled.div`
  display: flex;
  overflow: hidden;
  white-space: nowrap;
`;

const GalleryTrack = styled.div`
  display: flex;
  animation: ${scrollAnimation} 20s linear infinite;
`;

const GalleryTrackFast = styled(GalleryTrack)`
  animation-duration: 21s;
`;
const GalleryTrackMedium = styled(GalleryTrack)`
  animation-duration: 18s;
`;
const GalleryTrackSlow = styled(GalleryTrack)`
  animation-duration: 15s;
`;

const GalleryItem = styled.img`
  width: 200px;
  height: 150px;
  margin-right: 10px;
  object-fit: cover;
  border-radius: 4px;

  border-radius: 16px;
`;

export default GallerySection;
