import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { QuestionCategoriesOutput } from "api/brand/getQuestionCategories";
import { UpdateCategoryOutput } from "api/questionCard/category/updateCategory";
import { GET_QUESTION_CATEGORIES } from "constants/queryKeys";
import { QuestionCardDeck } from "interfaces/questionCardCategory";
import useDeleteCategory from "hooks/questionCard/category/useDeleteCategory";
import useUpdateCategory from "hooks/questionCard/category/useUpdateCategory";
import useSystemModal from "hooks/common/components/useSystemModal";
import { USER_NAME } from "configs";

interface Props {
  cardIndex: number;
  card: QuestionCardDeck;
}

const CardFooter = ({ cardIndex, card }: Props) => {
  const queryClient = useQueryClient();
  const { brandId } = useParams();
  const owner = localStorage.getItem(USER_NAME);
  const isTester = owner === "tester";
  const { openModal, showErrorModal, showAnyMessageModal } = useSystemModal();

  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: updateCategory } = useUpdateCategory();

  const handleToggleVisibility = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 브랜드 삭제 권한이 없습니다");
      return;
    }

    updateCategory(
      {
        question_card_category_id: card.id,
        requestBody: {
          name: card.name,
          isDeckVisible: !card.isDeckVisible,
        },
      },
      {
        onSuccess: (data: UpdateCategoryOutput) => {
          queryClient.setQueryData(
            [GET_QUESTION_CATEGORIES, brandId],
            (prevData: QuestionCategoriesOutput | undefined) => {
              if (!prevData) return prevData;
              const updatedDecks = prevData.allocatedQuestionCardDecList.map(
                (deck) =>
                  deck.id === data.id
                    ? { ...deck, isDeckVisible: data.isDeckVisible }
                    : deck
              );
              return {
                ...prevData,
                allocatedQuestionCardDecList: updatedDecks,
              };
            }
          );
        },
      }
    );
  };

  const handleDeleteButtonClick = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 브랜드 삭제 권한이 없습니다");
      return;
    }

    openModal({
      isOpen: true,
      showCancel: true,
      title: `${card.name} 카드 그룹을 삭제하시겠어요?`,
      message: "삭제할 경우 모든 카드가 제거됩니다.",
      onConfirm: () => {
        deleteCategory(card.id, {
          onSuccess: () => {
            queryClient.setQueryData(
              [GET_QUESTION_CATEGORIES, brandId],
              (prevData: QuestionCategoriesOutput | undefined) => {
                if (!prevData) return prevData;
                const updatedDecks = [...prevData.allocatedQuestionCardDecList];
                updatedDecks.splice(cardIndex, 1);
                return {
                  ...prevData,
                  allocatedQuestionCardDecList: updatedDecks,
                };
              }
            );
          },
          onError: (error) => {
            const errorDetail = error.response.data as { detail: string };
            showErrorModal(errorDetail.detail);
          },
        });
      },
    });
  };

  return (
    <Container>
      <ToggleSwitch
        onClick={handleToggleVisibility}
        isActive={card.isDeckVisible}
      >
        <ToggleCircle isActive={card.isDeckVisible} />
      </ToggleSwitch>
      <RemoveCardButton type="button" onClick={handleDeleteButtonClick}>
        그룹 삭제
      </RemoveCardButton>
    </Container>
  );
};

export default CardFooter;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
  margin-top: 1rem;
`;

const RemoveCardButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.palette.red900};
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
`;

const ToggleSwitch = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 50px;
  height: 28px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.palette.grey700 : theme.palette.grey300};
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ToggleCircle = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ isActive }) => (isActive ? "26px" : "2px")};
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
