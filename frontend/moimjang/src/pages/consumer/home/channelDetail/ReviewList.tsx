import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import userState from "recoils/atoms/auth/userState";
import { Pathnames } from "constants/admin";
import { noReviewUsers } from "constants/consumer/channel/reviewOption";
import { Review } from "interfaces/channels";
import useGetReviewList from "hooks/consumer/useGetReviewList";
import useHeader from "hooks/consumer/components/useHeader";

import plzFeedback1 from "assets/please_feed_back1.png";
import plzFeedback2 from "assets/please_feed_back2.png";
import ConsumerLayout from "components/consumer/common/ConsumerLayout";
import ReviewCard from "components/admin/channel/channelDetail/game/ReviewCard";

const ReviewList: React.FC = () => {
  const { data, refetch } = useGetReviewList();
  const [userData] = useRecoilState(userState);
  const reviews = data && data.length > 0 ? data : [];
  const { header } = useHeader();
  const navigate = useNavigate();
  const { channelId } = useParams();

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  useEffect(() => {
    header({
      visible: true,
      title: "대화 후기 확인하기",
      onBack: handleBackButtonClick,
      onRefresh: refetch,
    });
  }, []);

  useEffect(() => {
    if (
      !userData?.joined_channel.id ||
      userData.joined_channel.id !== Number(channelId)
    ) {
      navigate(Pathnames.Home);
    }
  }, [data, userData, channelId]);

  const userGender = userData.gender === "male" ? "🙋" : "🙋‍♀️";

  if (!reviews || reviews.length === 0) {
    return (
      <ConsumerLayout>
        <MainContent>
          <WelcomeMessage>
            <p>
              안녕하세요 {userGender}
              <strong>{userData.username}</strong>님,
            </p>
            <p>
              총 <strong>2</strong>개의 후기가 도착했어요.
            </p>
            <p>후기 작성자들의 첫인상과 </p>
            <p>대화 내용을 확인해보세요.</p>
          </WelcomeMessage>
          {noReviewUsers.map((review: Review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </MainContent>
        <WelcomeMessage>
          {userData.username}님 이번 소셜링에서 <br />
          즐거운 시간 되셨나요? 😊 <br />
          <br />
          만족하셨다면, 후기로 따뜻한 한마디
          <br />
          남겨주시면 큰 힘이 될 것 같아요!
          <br />
          <br />
          여러분의 후기가 다음 모임을 <br />
          더욱 특별하게 만듭니다. 💛
        </WelcomeMessage>
        <ImageWrapper>
          <Image src={plzFeedback1} />
          <Image src={plzFeedback2} />
        </ImageWrapper>
      </ConsumerLayout>
    );
  }

  return (
    <ConsumerLayout>
      <MainContent>
        <WelcomeMessage>
          <p>
            안녕하세요 {userGender}
            <strong>{userData.username}</strong>님,
          </p>
          <p>
            총 <strong>{reviews.length}</strong>개의 후기가 도착했어요.
          </p>
          <p>후기 작성자들의 첫인상과 </p>
          <p>대화 내용을 확인해보세요.</p>
        </WelcomeMessage>
        {reviews.map((review: Review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </MainContent>
      <WelcomeMessage>
        {userData.username}님 이번 소셜링에서 <br />
        즐거운 시간 되셨나요? 😊 <br />
        <br />
        만족하셨다면, 후기로 따뜻한 한마디
        <br />
        남겨주시면 큰 힘이 될 것 같아요!
        <br />
        <br />
        여러분의 후기가 다음 모임을 <br />
        더욱 특별하게 만듭니다. 💛
      </WelcomeMessage>
      <ImageWrapper>
        <Image src={plzFeedback1} />
        <Image src={plzFeedback2} />
      </ImageWrapper>
    </ConsumerLayout>
  );
};
const MainContent = styled.main`
  max-width: 430px;
  margin: 0 auto;
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #fff, #f7f7f7);
  border: 2px solid #dfe4ea;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  line-height: 1.6;
  text-align: center;
  font-family: "Arial", sans-serif;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;

  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 100%;
`;

export default ReviewList;
