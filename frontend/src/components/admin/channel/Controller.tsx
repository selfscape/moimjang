import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import { Pathnames } from "constants/admin";
import { useChannelTableContext } from "hooks/admin/channel/context/useChannelTableContext";
import { ChannelState } from "interfaces/channels";

import Button from "components/admin/common/Button";

const Controller = () => {
  const { filter, setFilter, refetch } = useChannelTableContext();
  const [_, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const handleCreateChannelButtonClick = () => {
    navigate(Pathnames.CreateChannel);
  };

  return (
    <Container>
      <LeftContainer>
        <Button
          size="big"
          className="positive"
          onClick={handleCreateChannelButtonClick}
        >
          <FaPlus style={{ marginRight: "6px" }} /> 소셜링 만들기
        </Button>
        <FilterWrapper>
          <label htmlFor="stateFilter">
            상태별로 보기:
            <StateSelect
              id="stateFilter"
              value={filter.state}
              onChange={(e) => {
                const value = e.target.value as keyof typeof ChannelState;
                setFilter((prev) => ({
                  ...prev,
                  state: ChannelState[value],
                }));
                setSearchParams({ page: "1" });
                refetch();
              }}
            >
              <option value={null}>전체</option>
              <option value={ChannelState.PENDING}>대기</option>
              <option value={ChannelState.ONGOING}>진행중</option>
              <option value={ChannelState.FULL}>정원 마감</option>
              <option value={ChannelState.FINISH}>종료</option>
            </StateSelect>
          </label>
        </FilterWrapper>
      </LeftContainer>
      <RightContainer>
        <label>
          <span>페이지당 개수:</span>
          <select value={filter.limit} onChange={(e) => handleSelectChange(e)}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <ActionButton onClick={handleSortButtonClick}>
          {filter.isDescending ? "내림차순" : "오름차순"}
        </ActionButton>
        <ActionButton onClick={() => refetch()}>새로 고침</ActionButton>
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
  margin-bottom: 16px;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
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

const ActionButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.palette.grey700};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey700};
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004085;
  }
`;

export default Controller;

const FilterWrapper = styled.div`
  display: inline-block;
  margin-left: 16px;
  font-size: 14px;
  color: #333;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StateSelect = styled.select`
  padding: 5px 10px;
  margin-left: 4px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.palette.blue900};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.grey300};
  }
`;
