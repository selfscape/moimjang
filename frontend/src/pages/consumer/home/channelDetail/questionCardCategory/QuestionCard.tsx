import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";

import { Pathnames } from "constants/admin";
import useHeader from "hooks/consumer/components/useHeader";
import useGetQuestionCards from "hooks/consumer/useGetQuestionCards";

import Carousel from "components/consumer/common/carousel/Carousel";
import ConsumerLayout from "components/consumer/common/ConsumerLayout";

const QuestionCard = () => {
  const navigate = useNavigate();
  const { header } = useHeader();
  const { channelId, categoryId } = useParams();
  const { state: categoryName } = useLocation();
  const { data: questionCards, refetch } = useGetQuestionCards(categoryId);

  const filteredImages = questionCards
    ?.filter((card) => card.isCardVisible)
    .map((card) => ({ id: card.id, thumbnail: card?.image?.url }));

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  useEffect(() => {
    header({
      visible: true,
      onBack: handleBackButtonClick,
      title: categoryName || "컨텐츠 박스",
      onRefresh: refetch,
    });
  }, []);
  return (
    <ConsumerLayout>
      <Container>
        {filteredImages && filteredImages.length > 0 ? (
          <Carousel imageList={filteredImages} />
        ) : (
          <NoData>아직 컨텐츠가 없습니다.</NoData>
        )}
      </Container>
    </ConsumerLayout>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
`;

const NoData = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #888;
`;

export default QuestionCard;
