import { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { CreateCategoryOutput } from "api/questionCard/category/createCategory";
import { JoinCategoryWithBrandOutput } from "api/brand/joinCategoryWithBrand";
import { QuestionCategoriesOutput } from "api/brand/getQuestionCategories";
import { GET_QUESTION_CATEGORIES } from "constants/queryKeys";
import { QuestionCardDeck } from "interfaces/questionCardCategory";
import useGetQuestionCategories from "api/brand/hooks/useGetQuestionCategories";
import useJoinCategoryWithBrand from "hooks/brand/useJoinCategoryWithBrand";
import useCreateCategory from "hooks/questionCard/category/useCreateCategory";
import useSystemModal from "hooks/common/components/useSystemModal";
import QuestionCardItem from "./QuestionCardItem";

const QuestionCardSection = () => {
  const queryClient = useQueryClient();
  const { brandId } = useParams();
  const { data } = useGetQuestionCategories(brandId);

  const { showErrorModal } = useSystemModal();

  const { mutate: joinCategoryWithBrand } = useJoinCategoryWithBrand();
  const { mutate: createCategory } = useCreateCategory();

  const cardCategories = data?.allocatedQuestionCardDecList || [];
  const [categoryName, setCategoryName] = useState("");

  const handleAddCard = () => {
    if (!categoryName || !brandId) return;

    createCategory(
      { name: categoryName, isDeckVisible: true },
      {
        onSuccess: (categoryData: CreateCategoryOutput) => {
          joinCategoryWithBrand(
            { brand_id: brandId, question_card_category_id: categoryData.id },
            {
              onSuccess: (joinData: JoinCategoryWithBrandOutput) => {
                const newQuestionCardDeck: QuestionCardDeck = {
                  id: categoryData.id,
                  name: categoryData.name,
                  isDeckVisible: categoryData.isDeckVisible,
                  coverImage: categoryData.coverImage,
                  questionCardList: [],
                };

                queryClient.setQueryData<QuestionCategoriesOutput>(
                  [GET_QUESTION_CATEGORIES, brandId],
                  (oldData) => {
                    if (!oldData) return oldData;
                    return {
                      ...oldData,
                      allocatedQuestionCardDecList: [
                        ...oldData.allocatedQuestionCardDecList,
                        newQuestionCardDeck,
                      ],
                    };
                  }
                );
                setCategoryName("");
              },
              onError: (error) => {
                const errorDetails = error.response.data as {
                  detail: string;
                };
                showErrorModal(errorDetails.detail);
              },
            }
          );
        },
        onError: (error) => {
          const errorDetails = error.response.data as {
            detail: string;
          };
          showErrorModal(errorDetails.detail);
        },
      }
    );
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <MainTitle>컨텐츠 목록</MainTitle>
        <CategoryInput
          type="text"
          placeholder="카테고리 이름 입력"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <AddCardButton
          type="button"
          onClick={handleAddCard}
          disabled={!categoryName}
        >
          + 카드 추가
        </AddCardButton>
      </SectionHeader>
      {cardCategories?.length > 0 &&
        cardCategories.map((card, index) => (
          <QuestionCardItem key={index} cardIndex={index} card={card} />
        ))}
    </SectionContainer>
  );
};

export default QuestionCardSection;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const CategoryInput = styled.input`
  padding: 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddCardButton = styled.button`
  color: #fff;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  background: ${({ theme: { palette } }) => palette.grey700};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
