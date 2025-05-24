import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

import useUpdateBrandState from "api/admin/brand/hooks/useUpdateBrandState";
import { Pathnames } from "constants/admin";
import { GET_BRANDS } from "constants/admin/queryKeys";

import useBrandTable from "hooks/admin/users/useBrandTable";
import useSystemModal from "hooks/common/components/useSystemModal";
import useDeleteBrand from "hooks/admin/brand/useDeleteBrand";
import { BrandState } from "interfaces/brand";

import { Table, TableContainer } from "../common/Table";
import Button from "../common/Button";
import OptimizedImage from "components/common/OptimizedImage";
import { GetBrandOutput } from "hooks/admin/brand/useGetBrands";

const brandStateLabels: Record<BrandState, string> = {
  [BrandState.ONGOING]: "진행중",
  [BrandState.FINISH]: "종료",
};

const BrandTable = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const queryClient = useQueryClient();
  const { brands, refetch, filter } = useBrandTable();
  const navigate = useNavigate();
  const { mutate: deleteBrand } = useDeleteBrand();
  const { openModal, showErrorModal, showAnyMessageModal } = useSystemModal();
  const { mutate: updateBrandState } = useUpdateBrandState();

  const handleDeleteButtonClick = (id: number, brandname: string) => {
    const queryKey = [
      GET_BRANDS,
      {
        state: filter.state,
        sort_by: null,
        descending: filter.isDescending,
        offset: (page - 1) * filter.limit,
        limit: filter.limit,
      },
    ];
    openModal({
      isOpen: true,
      title: `${brandname}을 삭제하시겠습니까?`,
      message: "삭제 하실 경우 다시 되돌리실 수 없습니다.",
      showCancel: true,
      onConfirm: () => {
        deleteBrand(String(id), {
          onSuccess: () => {
            queryClient.setQueryData<GetBrandOutput | undefined>(
              queryKey,
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  brands: old.brands.filter((b) => b.id !== id),
                  totalCount: old.totalCount - 1,
                };
              }
            );
          },
        });
      },
    });
  };

  const handleRowClick = (brandId: number) => {
    navigate(`${Pathnames.EditBrand}/${brandId}?mode=edit`);
  };

  const handleStateChange = (brandId: number, newState: BrandState) => {
    updateBrandState(
      { brand_id: brandId, brand_state: newState },
      {
        onSuccess: () => {
          showAnyMessageModal(
            `브랜드 상태가 ${brandStateLabels[newState]}(으)로
            변경되었습니다.`
          );

          refetch();
        },
        onError: (error) => {
          const errorDetails = (error.response?.data as { detail: string })
            ?.detail;
          showErrorModal(
            errorDetails || "브랜드 상태 변경 중 오류가 발생했습니다."
          );
        },
      }
    );
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>아이디</th>
            <th>썸네일</th>
            <th>브랜드명</th>
            <th>설명</th>
            <th>브랜드 상태</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {brands?.length > 0 ? (
            brands.map((brand) => (
              <tr
                key={brand.id}
                className="hover-row"
                onClick={() => handleRowClick(brand.id)}
              >
                <td>{brand.id}</td>
                <td>
                  <OptimizedImage
                    src={brand.thumbnailImage?.url}
                    width={40}
                    height={40}
                    mode="fit"
                    alt="brandImageThumbnail"
                  />
                </td>
                <td>{brand.title}</td>
                <td>{brand.description}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <StyledSelect
                    value={brand.brand_state || BrandState.ONGOING}
                    onChange={(e) =>
                      handleStateChange(brand.id, e.target.value as BrandState)
                    }
                    state={brand.brand_state}
                  >
                    {Object.values(BrandState).map((state) => (
                      <option key={state} value={state}>
                        {brandStateLabels[state]}
                      </option>
                    ))}
                  </StyledSelect>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="small"
                    className="positive"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteButtonClick(brand.id, brand.title);
                    }}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="no-data">
                등록된 브랜드가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

const StyledImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
`;

const Placeholder = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e5e7eb;
  color: #9ca3af;
  font-size: 24px;
`;

const StyledSelect = styled.select<{ state: BrandState }>`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  appearance: none;

  background-color: ${({ state, theme }) => {
    switch (state) {
      case BrandState.FINISH:
        return theme.palette.grey600;
      case BrandState.ONGOING:
        return theme.palette.blue900;
      default:
        return "inherit";
    }
  }};

  color: #fff;
`;

export default BrandTable;
