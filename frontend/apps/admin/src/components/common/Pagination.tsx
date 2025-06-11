import { useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import styled from "styled-components";

interface PaginationProps {
  totalItems: number;
  skip: number;
}

const Pagination = ({ totalItems, skip = 10 }: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / skip);
  const maxPageNumbers = 5;

  const startPage = Math.max(
    Math.floor((page - 1) / maxPageNumbers) * maxPageNumbers + 1,
    1
  );
  const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: newPage.toString() });
  };

  if (!totalItems) return <></>;

  return (
    <Wrapper>
      <NavButton onClick={() => goToPage(1)} disabled={page === 1}>
        <FaAngleDoubleLeft />
      </NavButton>
      <NavButton onClick={() => goToPage(page - 1)} disabled={page === 1}>
        <FaArrowLeft />
      </NavButton>

      <ButtonList>
        {[...Array(Math.max(0, endPage - startPage + 1))].map((_, index) => {
          const pageNum = startPage + index;
          return (
            <PageButton
              key={pageNum}
              className={pageNum === page ? "active" : ""}
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </PageButton>
          );
        })}
      </ButtonList>

      <NavButton
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
      >
        <FaArrowRight />
      </NavButton>
      <NavButton
        onClick={() => goToPage(totalPages)}
        disabled={page === totalPages}
      >
        <FaAngleDoubleRight />
      </NavButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  gap: 6px;
`;

const ButtonList = styled.div`
  display: flex;
  gap: 6px;
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  background: white;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;

  &.active {
    background-color: ${({ theme: { palette } }) => palette.grey700};
    color: white;
    font-weight: 700;
    border: none;
  }

  &:hover {
    background-color: #e5e7eb;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f3f4f6;
  transition: background 0.2s ease;

  background-color: #fff;

  &:hover {
    background-color: #e5e7eb;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    color: #555;
    font-size: 18px;
  }
`;

export default Pagination;
