import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { QuestionCategoriesOutput } from "api/brand/getQuestionCategories";
import { GET_QUESTION_CATEGORIES } from "constants/queryKeys";
import useDeleteQuestionCard from "hooks/questionCard/card/useDeleteQuestionCard";
import useUpdateQuestionCard from "hooks/questionCard/card/useUpdateQuestionCard";
import useUploadCardImage from "hooks/questionCard/card/useUploadCardImage";
import useSystemModal from "hooks/common/components/useSystemModal";
import { QuestionCard } from "interfaces/questionCardCategory";

import AddImageInput from "components/common/image/addImageInput";
import ProductImage from "components/common/image/ProductImage";
import { OWNER } from "configs";

interface BackImageItemProps {
  cardIndex: number;
  imgIndex: number;
  questionCardInfo: QuestionCard;
}

const BackImageItem: React.FC<BackImageItemProps> = ({
  cardIndex,
  imgIndex,
  questionCardInfo,
}) => {
  const { brandId } = useParams();
  const queryClient = useQueryClient();
  const { showErrorModal, showAnyMessageModal } = useSystemModal();

  const owner = localStorage.getItem(OWNER);
  const isTester = owner === "tester";

  const { mutate: deleteQuestionCard } = useDeleteQuestionCard();
  const { mutate: updateQuestionCard } = useUpdateQuestionCard();
  const { mutate: uploadCardImage } = useUploadCardImage();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    if (!e.target.files) return;
    const file = e.target.files[0];

    uploadCardImage(
      {
        card_id: questionCardInfo.id,
        file,
      },
      {
        onSuccess: (data: QuestionCard) => {
          queryClient.setQueryData(
            [GET_QUESTION_CATEGORIES, brandId],
            (prevData: QuestionCategoriesOutput | undefined) => {
              if (!prevData) return prevData;
              const updatedDecks = [...prevData.allocatedQuestionCardDecList];
              if (!updatedDecks[cardIndex]) return prevData;
              const targetDeck = updatedDecks[cardIndex];
              if (
                !targetDeck.questionCardList ||
                targetDeck.questionCardList.length <= imgIndex
              ) {
                return prevData;
              }
              const updatedQuestionCardList = targetDeck.questionCardList.map(
                (questionCard, index) =>
                  index === imgIndex ? data : questionCard
              );
              updatedDecks[cardIndex] = {
                ...targetDeck,
                questionCardList: updatedQuestionCardList,
              };
              return {
                ...prevData,
                allocatedQuestionCardDecList: updatedDecks,
              };
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

  const handleClear = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    queryClient.setQueryData(
      [GET_QUESTION_CATEGORIES, brandId],
      (prevData: QuestionCategoriesOutput | undefined) => {
        if (!prevData) return prevData;
        const updatedDecks = [...prevData.allocatedQuestionCardDecList];
        if (!updatedDecks[cardIndex]) return prevData;
        const targetDeck = updatedDecks[cardIndex];
        if (
          !targetDeck.questionCardList ||
          targetDeck.questionCardList.length <= imgIndex
        ) {
          return prevData;
        }
        const updatedQuestionCardList = targetDeck.questionCardList.map(
          (questionCard, index) =>
            index === imgIndex ? { ...questionCard, image: null } : questionCard
        );
        updatedDecks[cardIndex] = {
          ...targetDeck,
          questionCardList: updatedQuestionCardList,
        };
        return {
          ...prevData,
          allocatedQuestionCardDecList: updatedDecks,
        };
      }
    );
  };

  const handleToggleVisibility = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    updateQuestionCard(
      {
        card_id: questionCardInfo.id,
        requestBody: {
          cardCategoryId: questionCardInfo.cardCategoryId,
          name: questionCardInfo.name,
          isCardVisible: !questionCardInfo.isCardVisible,
        },
      },
      {
        onSuccess: (data: QuestionCard) => {
          queryClient.setQueryData(
            [GET_QUESTION_CATEGORIES, brandId],
            (prevData: QuestionCategoriesOutput | undefined) => {
              if (!prevData) return prevData;
              const updatedDecks = [...prevData.allocatedQuestionCardDecList];
              if (!updatedDecks[cardIndex]) return prevData;
              const targetDeck = updatedDecks[cardIndex];
              if (
                !targetDeck.questionCardList ||
                targetDeck.questionCardList.length <= imgIndex
              ) {
                return prevData;
              }
              const updatedQuestionCardList = targetDeck.questionCardList.map(
                (questionCard, index) =>
                  index === imgIndex ? data : questionCard
              );
              updatedDecks[cardIndex] = {
                ...targetDeck,
                questionCardList: updatedQuestionCardList,
              };
              return {
                ...prevData,
                allocatedQuestionCardDecList: updatedDecks,
              };
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

  const handleDelete = (question_card_id: number) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    deleteQuestionCard(question_card_id, {
      onSuccess: () => {
        queryClient.setQueryData(
          [GET_QUESTION_CATEGORIES, brandId],
          (prevData: QuestionCategoriesOutput | undefined) => {
            if (!prevData) return prevData;
            const updatedDecks = [...prevData.allocatedQuestionCardDecList];
            if (!updatedDecks[cardIndex]) return prevData;
            const targetDeck = updatedDecks[cardIndex];
            if (
              !targetDeck.questionCardList ||
              targetDeck.questionCardList.length <= imgIndex
            ) {
              return prevData;
            }
            const updatedQuestionCardList = targetDeck.questionCardList.filter(
              (_, index) => index !== imgIndex
            );
            updatedDecks[cardIndex] = {
              ...targetDeck,
              questionCardList: updatedQuestionCardList,
            };
            return {
              ...prevData,
              allocatedQuestionCardDecList: updatedDecks,
            };
          }
        );
      },
    });
  };

  return (
    <ItemContainer>
      <FieldGroup>
        <ImageContainer>
          <ImageUploadWrapper>
            <AddImageInput width="175px" height="300px">
              <HiddenInput
                type="file"
                id={`back-file-upload-${cardIndex}-${imgIndex}`}
                accept="image/*"
                onChange={handleUpload}
              />
            </AddImageInput>
          </ImageUploadWrapper>
          {questionCardInfo?.image?.url && (
            <ProductImage
              width="175px"
              height="300px"
              imageSource={questionCardInfo.image?.url}
              handleRemoveButtonClick={handleClear}
              handleImageInputChange={handleUpload}
            />
          )}
        </ImageContainer>
        <BottomContainer>
          <ToggleSwitch
            onClick={handleToggleVisibility}
            isActive={questionCardInfo.isCardVisible}
          >
            <ToggleCircle isActive={questionCardInfo.isCardVisible} />
          </ToggleSwitch>

          <DeleteButton
            type="button"
            onClick={() => handleDelete(questionCardInfo.id)}
          >
            카드 삭제
          </DeleteButton>
        </BottomContainer>
      </FieldGroup>
    </ItemContainer>
  );
};

export default BackImageItem;

const ItemContainer = styled.div`
  /* 필요에 따라 추가 스타일 작성 */
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 1rem;
`;

const ImageContainer = styled.div`
  width: 175px;
  height: 300px;
`;

const ImageUploadWrapper = styled.div`
  position: relative;
`;

const HiddenInput = styled.input.attrs({
  type: "file",
  accept: "image/*",
})`
  visibility: hidden;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

const ToggleSwitch = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 50px;
  height: 26px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.palette.grey700 : "#ccc"};
  border-radius: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ToggleCircle = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 3px;
  left: ${({ isActive }) => (isActive ? "26px" : "3px")};
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  transition: left 0.3s ease;
`;

const DeleteButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.grey600};
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
`;
