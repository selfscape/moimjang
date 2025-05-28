import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaUsers } from "react-icons/fa";

import { Pathnames } from "constants/admin";
import useGetLandingBrand from "api/landing/hook/useGetLandingBrand";

import useGetLandingChannels from "api/landing/hook/useGetLandingChannels";
import useHeader from "hooks/consumer/components/useHeader";
import normalizeData from "utils/landing/brandLanding/normalizeData";
import { NormalizeDataOutput } from "utils/landing/brandLanding/normalizeData";
import { ChannelState } from "interfaces/channels";

import useGetLandingBrandReviews from "api/landing/hook/useGetLandingBrandReviews";
import BrandingLayout from "components/landing/common/BrandingLayout";
import PhotoReview from "components/landing/productDetail/PhotoReview";

const LandingDetail = () => {
  const { header } = useHeader();

  const navigate = useNavigate();
  const { brandId } = useParams();

  const { data: landingBrandData } = useGetLandingBrand(brandId);

  const { data: landingChannelData } = useGetLandingChannels({
    brand_id: brandId,
    state: ChannelState.ONGOING,
    sort_by: null,
    descending: true,
  });

  const landdingChannels = landingChannelData?.channels;
  const { data } = useGetLandingBrandReviews();

  const brandReviews = data?.reviews;

  const [selectedSession, setSelectedSession] = useState<number>();

  const {
    thumbnail,
    title,
    description,
    maxParticipants,
    meetingLocation,
    schedulesByMonth,
    photoReviews,
    detailImages,
    socialingDuration,
  }: NormalizeDataOutput = normalizeData(
    landingBrandData,
    landdingChannels,
    brandReviews
  );

  const handleApply = () => {
    if (!selectedSession) return;
    navigate(`${Pathnames.RegistForm}`, {
      state: {
        brandId: brandId,
        socialingId: selectedSession,
        thumbnail,
      },
    });
  };

  useEffect(() => {
    header({
      visible: true,
      title,
      onBack: () => navigate(-1),
    });
  }, [title]);

  return (
    <BrandingLayout style={{ marginTop: "60px" }}>
      <Container>
        <Thumbnail src={thumbnail} alt="Thumbnail" />
        <DetailSection>
          <TitleContainer>
            <BrandName>{title}</BrandName>
            <Title>{description}</Title>
          </TitleContainer>

          <InfoContainer>
            <InfoItem>
              <FaMapMarkerAlt size={18} />
              <InfoText>{meetingLocation} &nbsp;</InfoText>
            </InfoItem>
            <InfoItem>
              <FaUsers size={18} />
              <InfoText>최대 수용 가능 인원 {maxParticipants}명</InfoText>
            </InfoItem>
            <InfoItem>
              <FaClock size={18} />
              <InfoText>진행 시간 {socialingDuration}시간</InfoText>
            </InfoItem>
          </InfoContainer>

          {Object.entries(schedulesByMonth).map(([month, schedules]) => (
            <ScheduleWrapper key={month}>
              <ScheduleTitle>{month}월</ScheduleTitle>
              <ScheduleList>
                {schedules.map((item) => {
                  const isSelected = item.id === selectedSession;
                  return (
                    <ScheduleItem
                      key={item.id}
                      isSelected={isSelected}
                      onClick={() => setSelectedSession(item.id)}
                    >
                      <RadioButton
                        type="radio"
                        name="schedule"
                        value={item.id}
                        checked={isSelected}
                        onChange={() => setSelectedSession(item.id)}
                      />
                      <DateInfo>
                        <Day>{item.day}</Day>
                        <DateText>{item.date}</DateText>
                      </DateInfo>
                      <TimeInfo>{item.time}</TimeInfo>
                    </ScheduleItem>
                  );
                })}
              </ScheduleList>
            </ScheduleWrapper>
          ))}

          <ApplyButton onClick={handleApply} disabled={!selectedSession}>
            신청하기
          </ApplyButton>
        </DetailSection>

        <PhotoReview
          reviews={photoReviews}
          moreReviewsUrl={`${Pathnames.LandingProduct}/${brandId}/review`}
        />

        <DetailImageSection>
          {detailImages.map(({ url, id }) => (
            <DetailImg key={id} src={url} alt={`$Detail-image-${id}`} />
          ))}
        </DetailImageSection>
      </Container>
    </BrandingLayout>
  );
};

export default LandingDetail;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(236, 238, 239);
`;

const Thumbnail = styled.img`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DetailSection = styled.div`
  padding: 0px 20px 20px 20px;
  background-color: #fff;
`;

const TitleContainer = styled.div`
  margin-bottom: unset;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(230, 230, 230, 0.5);
`;

const BrandName = styled.h1`
  margin-top: 20px;
  margin-bottom: 4px;
  font-weight: 400;
  font-size: 0.9375rem;
  line-height: 1.375rem;
  color: rgb(138, 141, 142);
  text-align: left;
`;

const Title = styled.h1`
  color: #252525;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.08px;
  margin-bottom: 15px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(230, 230, 230, 0.5);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #252525;
`;

const InfoText = styled.span`
  margin-left: 6px;
  white-space: nowrap;
`;

const ScheduleWrapper = styled.div`
  margin-top: 24px;
`;

const ScheduleTitle = styled.h2`
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #111;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ScheduleItem = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid ${({ isSelected }) => (isSelected ? "#111" : "#ddd")};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: #111;
  }
`;

const RadioButton = styled.input`
  margin-right: 12px;
  cursor: pointer;
  accent-color: #111;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`;

const Day = styled.span`
  font-size: 0.875rem;
  color: #333;
`;

const DateText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
`;

const TimeInfo = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
`;

const ApplyButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px auto 0;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#111")};

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#111")};
  }
`;

const DetailImageSection = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const DetailImg = styled.img`
  width: 100%;
  display: block;
`;
