import styled from "styled-components";
import useGetBrandById from "hooks/consumer/useGetBrandById";
import { ChannelState, Channel } from "api/admin/channel/type/channel";

import { FaGamepad, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import useJoinChannel from "hooks/consumer/useJoinChannel";
import { useNavigate } from "react-router-dom";
import { Pathnames } from "constants/admin";

interface Props {
  brandId: number;
  channelData: Channel;
}

const BrandInfo = ({ channelData, brandId }: Props) => {
  const navigate = useNavigate();
  const { data } = useGetBrandById(brandId);
  const { mutate: joinChannel } = useJoinChannel();

  const channelState = channelData.channel_state;

  const handleCardButtonClick = () => {
    if (channelState === ChannelState.PENDING) return;

    joinChannel(channelData.id, {
      onSuccess: () => {
        navigate(`${Pathnames.ChannelDetail}/${channelData.id}`);
      },
      onError(error) {
        const errorMessage = error?.response?.data as { detail: string };

        if (errorMessage.detail === "이미 채널에 가입되어 있습니다.") {
          navigate(`${Pathnames.ChannelDetail}/${channelData.id}`);
        }

        if (errorMessage.detail === "Internal Server Error") {
          alert(errorMessage.detail);
        }
      },
    });
  };

  const meetingLocation = data?.meeting_location;
  const locationLink = data?.location_link;
  const joinedUsers = channelData?.joined_users?.length || 0;

  return (
    <Container onClick={handleCardButtonClick}>
      <ThumbnailImage src={data?.thumbnailImage?.url} />
      <ChannelHeader>
        <ChannelTitle>{channelData.title}</ChannelTitle>
      </ChannelHeader>
      <GameInfo>
        <FaGamepad />
        <span>{channelData.description}</span>
      </GameInfo>
      <LocationInfo>
        <FaMapMarkerAlt />
        {locationLink ? (
          <LocationLink
            href={locationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {meetingLocation}
          </LocationLink>
        ) : (
          <span>{meetingLocation}</span>
        )}
      </LocationInfo>

      <ParticipantsInfo>
        <FaUsers />
        <span>{joinedUsers}명 참여 중</span>
      </ParticipantsInfo>

      <JoinButton
        disabled={
          channelState === ChannelState.FINISH ||
          channelState === ChannelState.PENDING
        }
      >
        {channelState === ChannelState.FINISH && "종료"}
        {channelState === ChannelState.PENDING && "대기"}
        {channelState === ChannelState.ONGOING && "참여하기"}
      </JoinButton>
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;
  margin-bottom: 0.75rem;
`;

const ChannelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const ChannelTitle = styled.h3`
  font-size: 1.125rem;

  @media (max-width: 430px) {
    font-size: 1rem;
  }
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;

  @media (max-width: 430px) {
    font-size: 0.75rem;
  }
`;

const JoinButton = styled.button`
  background-color: #524634;
  color: white;
  font-weight: bold;
  padding: 1rem;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-size: 1.3rem;

  &:hover {
    background-color: #260000;
  }

  &:disabled {
    background-color: #cdcdcc;
  }

  &:active {
    background-color: #260000;
  }

  @media (max-width: 430px) {
    padding: 0.4rem 0.8rem;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
`;

const LocationLink = styled.a`
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ParticipantsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
`;

export default BrandInfo;
