import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useRecoilState } from "recoil";
import userState from "recoils/atoms/auth/userState";
import ConsumerLayout from "components/consumer/common/ConsumerLayout";
import Header from "components/consumer/common/Header";
import { Pathnames } from "constants/admin";

const Profile = () => {
  const navigate = useNavigate();
  const [userData] = useRecoilState(userState);
  const profileData = userData;
  const avatar = profileData.gender === "male" ? "👨" : "👩";

  const handleProfileEditButtonClick = () => {
    navigate(Pathnames.EditProfile);
  };

  return (
    <ConsumerLayout>
      <ProfilePage>
        <Header title="프로필" onBack={undefined} />
        <ProfileContent>
          <ProfileHeader>
            <Avatar>{avatar}</Avatar>
            <UserName>{profileData.username || "정보 없음"}</UserName>
          </ProfileHeader>

          <ActionButton onClick={handleProfileEditButtonClick}>
            프로필 수정하기
          </ActionButton>

          <ProfileInfo>
            <ProfileCard>
              <InfoRow>
                <Label>성별</Label>
                <Value>
                  {profileData.gender === "male"
                    ? "남성"
                    : "여성" || "정보 없음"}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>출생연도</Label>
                <Value>{profileData.birth_year || "정보 없음"}년</Value>
              </InfoRow>
              <InfoRow>
                <Label>MBTI</Label>
                <Value>{profileData.mbti || "정보 없음"}</Value>
              </InfoRow>
            </ProfileCard>

            {/* <ProfileCard>
              <CardTitle>나의 취미</CardTitle>
              <p>{profileData.hobby || "정보 없음"}</p>
            </ProfileCard>

            <ProfileCard>
              <CardTitle>나의 매력 및 장점</CardTitle>
              <p>{profileData.strength || "정보 없음"}</p>
            </ProfileCard>

            <ProfileCard>
              <CardTitle>나를 표현하는 3가지 단어</CardTitle>
              <KeywordContainer>
                {Array.isArray(profileData?.keywords) ? (
                  profileData.keywords.map((keyword, index) => (
                    <Keyword key={index}>{keyword || "정보 없음"}</Keyword>
                  ))
                ) : (
                  <Keyword>{profileData?.keywords || "정보 없음"}</Keyword>
                )}
              </KeywordContainer>
            </ProfileCard>

            <ProfileCard>
              <CardTitle>가장 감명 깊었던 작품</CardTitle>
              <p>{profileData.favorite_media || "정보 없음"}</p>
            </ProfileCard>

            <ProfileCard>
              <CardTitle>최근에 기분 좋았던 일</CardTitle>
              <p>{profileData.happyMoment || "정보 없음"}</p>
            </ProfileCard>

            <ProfileCard>
              <CardTitle>나의 TMI</CardTitle>
              <p>{profileData.tmi || "정보 없음"}</p>
            </ProfileCard> */}
          </ProfileInfo>
        </ProfileContent>
      </ProfilePage>
    </ConsumerLayout>
  );
};

// 페이지 전체 래퍼
const ProfilePage = styled.div`
  background-color: #fff;
  height: 100vh;
  padding-bottom: 20px;
`;

// 메인 컨텐츠
const ProfileContent = styled.main`
  padding: 24px 16px;
`;

// 상단 아바타, 닉네임
const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

// 프로필 상세정보
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 카드(공통)
const popUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  animation: ${popUp} 0.3s ease forwards;

  &:hover {
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08);
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.span`
  color: #6b7280;
`;

const Value = styled.span`
  font-weight: 500;
`;

const CardTitle = styled.h3`
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
`;

const KeywordContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Keyword = styled.span`
  background-color: #dbeafe;
  color: #2563eb;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #2563eb;
    color: white;
  }
`;

const ActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  margin: 0 auto;
  margin-bottom: 16px;
  font-size: 1rem;
  gap: 0.5rem;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  background-color: #dbeafe;
  color: #2563eb;
`;

export default Profile;
