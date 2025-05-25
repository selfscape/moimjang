import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import useUserTable from "hooks/admin/users/useUserTable";
import Button from "../common/Button";

const Controller = () => {
  const [_, setSearchParams] = useSearchParams();

  const { filter, setFilter, refetchUser } = useUserTable();

  const handleSortButtonClick = () => {
    setFilter((prev) => ({ ...prev, isDescending: !prev.isDescending }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({
      ...prev,
      limit: Number(e.target.value),
    }));

    setSearchParams({ page: "1" });
  };

  return (
    <Container>
      <LeftContainer></LeftContainer>
      <RightContainer>
        <label>
          <span>페이지당 개수:</span>
          <select value={filter.limit} onChange={(e) => handleSelectChange(e)}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
        <Button size="big" className="positive" onClick={handleSortButtonClick}>
          {filter.isDescending ? "내림차순" : "오름차순"}
        </Button>
        <Button size="big" className="positive" onClick={() => refetchUser()}>
          새로 고침
        </Button>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 16px;
`;

const LeftContainer = styled.div`
  display: flex;
  gap: 16px;

  label {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: #333;
    gap: 10px;

    span {
      font-weight: 500;
    }

    select {
      padding: 5px 10px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
      transition: border-color 0.2s;

      &:focus {
        border-color: #007bff;
      }
    }
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  label {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: #333;
    gap: 10px;

    span {
      font-weight: 500;
    }

    select {
      padding: 5px 10px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
      transition: border-color 0.2s;

      &:focus {
        border-color: #007bff;
      }
    }
  }
`;

export default Controller;
