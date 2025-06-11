import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { QuestionCategoriesOutput } from "api/brand/getQuestionCategories";
import { UploadCoverImageOutput } from "api/questionCard/category/uploadCoverImage";
import { GET_QUESTION_CATEGORIES } from "constants/queryKeys";
import useUploadCoverImage from "hooks/questionCard/category/useUploadCoverImage";
import useCreateQuestionCard from "hooks/questionCard/card/useCreateQuestionCard";
import useSystemModal from "hooks/common/components/useSystemModal";
import {
  QuestionCard,
  QuestionCardDeck,
} from "interfaces/questionCardCategory";

import BackImageItem from "./BackImageItem";
import AddImageInput from "components/common/image/addImageInput";
import ProductImage from "components/common/image/ProductImage";
import CardFooter from "./CardFooter";

interface QuestionCardItemProps {
  cardIndex: number;
  card: QuestionCardDeck;
}

const QuestionCardItem: React.FC<QuestionCardItemProps> = ({
  cardIndex,
  card,
}) => {
  const { brandId } = useParams();
  const queryClient = useQueryClient();
  const { mutate: createQuestionCard } = useCreateQuestionCard();
  const { mutate: uploadCoverImage } = useUploadCoverImage();
  const { showErrorModal } = useSystemModal();

  const handleUploadFrontImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    uploadCoverImage(
      { file, question_card_category_id: card.id },
      {
        onSuccess: (data: UploadCoverImageOutput) => {
          queryClient.setQueryData(
            [GET_QUESTION_CATEGORIES, brandId],
            (prevData: QuestionCategoriesOutput | undefined) => {
              if (!prevData) return prevData;
              const updatedDecks = [...prevData.allocatedQuestionCardDecList];
              if (!updatedDecks[cardIndex]) return prevData;
              const targetDeck = updatedDecks[cardIndex];
              updatedDecks[cardIndex] = {
                ...targetDeck,
                coverImage: data.coverImage,
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

  const handleRemoveFrontImage = () => {
    queryClient.setQueryData(
      [GET_QUESTION_CATEGORIES, brandId],
      (prevData: QuestionCategoriesOutput | undefined) => {
        if (!prevData) return prevData;
        const updatedDecks = [...prevData.allocatedQuestionCardDecList];
        if (!updatedDecks[cardIndex]) return prevData;
        const targetDeck = updatedDecks[cardIndex];
        updatedDecks[cardIndex] = {
          ...targetDeck,
          coverImage: null,
        };
        return {
          ...prevData,
          allocatedQuestionCardDecList: updatedDecks,
        };
      }
    );
  };

  const handleAddBackImage = (cardIndex: number, cardCategoryId: number) => {
    createQuestionCard(
      {
        name: `temp-${cardCategoryId}-${cardIndex}`,
        cardCategoryId,
        isCardVisible: true,
      },
      {
        onSuccess: (data: QuestionCard) => {
          queryClient.setQueryData(
            [GET_QUESTION_CATEGORIES, brandId],
            (prevData: QuestionCategoriesOutput | undefined) => {
              if (!prevData) return;
              const updatedDecks = [...prevData.allocatedQuestionCardDecList];
              if (!updatedDecks[cardIndex]) return prevData;
              const targetDeck = updatedDecks[cardIndex];

              const updatedQuestionCardList = targetDeck.questionCardList
                ? [...targetDeck.questionCardList, data]
                : [data];

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

  const hasQuestionCardList = card?.questionCardList.length > 0;

  return (
    <CardItem>
      <FieldGroup>
        <SectionLabel>카테고리</SectionLabel>
        <CategoryName>{card.name}</CategoryName>
      </FieldGroup>

      <FieldGroup>
        <SectionLabel>전면 이미지</SectionLabel>

        <ImageContainer>
          <ImageUploadWrapper>
            <AddImageInput width="175px" height="300px">
              <HiddenInput
                type="file"
                id={`front-file-upload-${cardIndex}`}
                accept="image/*"
                onChange={handleUploadFrontImage}
              />
            </AddImageInput>
            {card?.coverImage?.url && (
              <ProductImage
                width="175px"
                height="300px"
                imageSource={card.coverImage.url}
                handleRemoveButtonClick={handleRemoveFrontImage}
                handleImageInputChange={handleUploadFrontImage}
              />
            )}
          </ImageUploadWrapper>
        </ImageContainer>
      </FieldGroup>

      <BackImageSection>
        <SectionHeader>
          <SectionSubTitle>후면 이미지</SectionSubTitle>
          <AddButton
            type="button"
            onClick={() => handleAddBackImage(cardIndex, card.id)}
          >
            + 후면 이미지 추가
          </AddButton>
        </SectionHeader>
        <BackImageItemContainer>
          {hasQuestionCardList &&
            card.questionCardList?.map((questionCardInfo, imgIndex) => (
              <BackImageItem
                key={imgIndex}
                cardIndex={cardIndex}
                imgIndex={imgIndex}
                questionCardInfo={questionCardInfo}
              />
            ))}
        </BackImageItemContainer>
      </BackImageSection>

      <CardFooter cardIndex={cardIndex} card={card} />
    </CardItem>
  );
};

export default QuestionCardItem;

const CardItem = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f4f6fb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SectionLabel = styled.label`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
`;

const CategoryName = styled.span`
  font-size: 1.2rem;
  color: #333;
  font-weight: bolder;
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

const BackImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  margin-bottom: 1.2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SectionSubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const BackImageItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
`;

const AddButton = styled.button`
  color: #fff;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;

  background: ${({ theme: { palette } }) => palette.grey700};
`;
