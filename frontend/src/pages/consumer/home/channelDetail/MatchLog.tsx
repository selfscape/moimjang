import React, { useEffect } from "react";
import styled from "styled-components";

import explain_zero from "assets/images/iceBreakingGame/0.png";
import explain_one from "assets/images/iceBreakingGame/1.png";
import explain_two from "assets/images/iceBreakingGame/2.png";
import useGetMatchedUser from "hooks/consumer/useGetMathcedUser";
import ConsumerLayout from "components/consumer/common/ConsumerLayout";
import useHeader from "hooks/consumer/components/useHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Pathnames } from "constants/admin";
import { useRecoilState } from "recoil";
import userState from "recoils/atoms/auth/userState";

const MatchLog: React.FC = () => {
  const [userData] = useRecoilState(userState);
  const navigate = useNavigate();
  const { data, refetch } = useGetMatchedUser();
  const { header } = useHeader();
  const { channelId } = useParams();

  const matchedUser = data?.[0]?.matched_user;
  const matchedUserName = matchedUser?.username || null;
  const matchedUserGender = matchedUser?.gender === "male" ? "🙋‍♂️" : "🙋‍♀️";

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  useEffect(() => {
    header({
      visible: true,
      title: "첫인상 게임",
      onRefresh: refetch,
      onBack: handleBackButtonClick,
    });
  }, [header, refetch]);

  useEffect(() => {
    if (
      !userData?.joined_channel.id ||
      userData.joined_channel.id !== Number(channelId)
    ) {
      navigate(Pathnames.Home);
    }
  }, [data, userData, channelId]);

  return (
    <ConsumerLayout>
      <Container>
        <ImageWrapper style={{ marginBottom: "32px" }}>
          <MemberImage src={explain_zero} alt="매치 유저 설명" />

          <MemberCard>
            {matchedUserName ? (
              <>
                <MemberGender>{matchedUserGender}</MemberGender>
                <MemberName>{matchedUserName}</MemberName>
              </>
            ) : (
              <MemberName>???</MemberName>
            )}
          </MemberCard>
        </ImageWrapper>
        <ImageWrapper>
          <Image src={explain_one} alt="누가? 누구를" />
          <Image src={explain_two} alt="누가? 누구를" />
        </ImageWrapper>
      </Container>
    </ConsumerLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;

  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  margin: 0;
`;

const MemberImage = styled.img`
  width: 100%;
`;

const Image = styled.img`
  width: 100%;
`;

const MemberCard = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.2);
  white-space: nowrap;

  display: flex;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const MemberGender = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const MemberName = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #111;
`;

export default MatchLog;
