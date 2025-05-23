import { useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useGetQuestionCardCategories from "api/admin/brand/hooks/useGetQuestionCardCategories";
import { Pathnames } from "constants/admin";
import useHeader from "hooks/consumer/components/useHeader";
import ConsumerLayout from "components/consumer/common/ConsumerLayout";

const QuestionCardCategory = () => {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const { header } = useHeader();
  const { state: brandId } = useLocation();
  const { data: questionCardCategories, refetch } =
    useGetQuestionCardCategories(brandId);

  const handleCardClick = (categoryId: string, categoryName: string) => {
    navigate(
      `${Pathnames.ChannelDetail}/${channelId}/questionCard/${categoryId}`,
      { state: categoryName }
    );
  };

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  useEffect(() => {
    header({
      visible: true,
      onBack: handleBackButtonClick,
      title: "컨텐츠 박스",
      onRefresh: refetch,
    });
  }, []);

  return (
    <ConsumerLayout>
      <Container>
        {questionCardCategories
          ?.filter((category) => category.isDeckVisible)
          .map((category) => (
            <CardWrapper
              key={category.id}
              onClick={() =>
                handleCardClick(String(category.id), category?.name)
              }
            >
              <CoverImage src={category?.coverImage?.url} alt={category.name} />
            </CardWrapper>
          ))}
      </Container>
    </ConsumerLayout>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const CoverImage = styled.img`
  width: 100%;
  display: block;
`;

const CardWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
  }
`;

const CardLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
`;

export default QuestionCardCategory;
