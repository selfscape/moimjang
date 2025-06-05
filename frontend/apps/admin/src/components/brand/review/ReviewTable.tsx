import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import useUpdateBrandReview from "api/brand/hooks/useUpdateBrandReview";
import useDeleteBrandReview from "api/brand/hooks/useDeleteBrandReview";
import { useBrandReviewContext } from "hooks/brand/context/useBrandReviewContext";
import useSystemModal from "hooks/common/components/useSystemModal";
import { BRAND_REVIEWS } from "constants/queryKeys";
import OptimizedImage from "components/common/image/OptimizedImage";

const ReviewTable = () => {
  const { isLoading, brandReviews, error, setEnlargedImageUrl } =
    useBrandReviewContext();

  const queryClient = useQueryClient();
  const { mutate: deleteBrandReview } = useDeleteBrandReview();
  const { mutate: updateBrandReview } = useUpdateBrandReview();

  const { openModal, showErrorModal, closeModal } = useSystemModal();

  const handleDeleteReview = (id: number) => {
    openModal({
      isOpen: true,
      confirmText: "삭제하기",
      cancelText: "취소",
      showCancel: true,
      title: "정말 삭제하시겠습니까?",
      message: "삭제한 후기는 다시 복구가 불가능합니다.",
      onConfirm: () => {
        deleteBrandReview(id, {
          onSuccess: () => {
            queryClient.setQueryData([BRAND_REVIEWS], (oldData: any) => {
              if (!oldData) return oldData;
              return oldData.filter((review: any) => review.id !== id);
            });
            closeModal();
          },
          onError: (error) => {
            const errorMessage = error.message;
            showErrorModal(errorMessage);
          },
        });
      },
      onCancel: () => closeModal(),
    });
  };

  const handleToggleDisplay = (review: any) => {
    updateBrandReview(
      {
        requestBody: {
          is_display: !review.isDisplay,
        },
        review_id: review.id,
      },
      {
        onSuccess: () => {
          queryClient.setQueryData([BRAND_REVIEWS], (oldData: any) => {
            if (!oldData) return oldData;
            return oldData.map((r: any) =>
              r.id === review.id ? { ...r, is_display: !review.isDisplay } : r
            );
          });
        },
        onError: (error: any) => {
          showErrorModal(error.message);
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews</div>;
  if (!brandReviews || brandReviews.length === 0) {
    return <div style={{ margin: "0 auto" }}>리뷰가 존재하지 않습니다.</div>;
  }

  return (
    <Container>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>User ID</Th>
          <Th>Contents</Th>
          <Th>Images</Th>
          <Th>Display</Th>
          <Th>삭제</Th>
        </tr>
      </thead>
      <tbody>
        {brandReviews.map((review) => (
          <TableRow key={review.id}>
            <Td>{review.id}</Td>
            <Td>{review.brandId}</Td>
            <Td style={{ maxWidth: "300px" }}>
              <ContentWrapper>{review.contents}</ContentWrapper>
            </Td>
            <Td>
              <ImageWrapper>
                {review?.imageList?.map((img, index) => (
                  <OptimizedImage
                    width={50}
                    height={50}
                    key={index}
                    src={img.url}
                    alt={`image-${index}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnlargedImageUrl(img.url);
                    }}
                  />
                ))}
              </ImageWrapper>
            </Td>
            <Td>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  checked={review.is_display}
                  onChange={() => handleToggleDisplay(review)}
                />
                <span />
              </ToggleSwitch>
            </Td>
            <Td>
              <DeleteReviewButton onClick={() => handleDeleteReview(review.id)}>
                삭제
              </DeleteReviewButton>
            </Td>
          </TableRow>
        ))}
      </tbody>
    </Container>
  );
};

const Container = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e5e5;
  background-color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
`;

const TableRow = styled.tr`
  height: 60px;
`;

const Th = styled.th`
  height: 60px;
  background-color: #f7f7f7;
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;

  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
`;

const Td = styled.td`
  padding: 0 16px;
  border-bottom: 1px solid #e5e5e5;
  vertical-align: middle;
  font-size: 14px;
  height: 60px;
  text-align: center;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 20px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ${({ theme: { palette } }) => palette.grey700};
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const DeleteReviewButton = styled.button`
  background-color: ${({ theme }) => theme.palette.red900};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
`;

const ContentWrapper = styled.div`
  max-height: 60px;
  overflow: auto;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export default ReviewTable;
