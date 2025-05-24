import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { FaRandom } from "react-icons/fa";

import { Group } from "interfaces/group";
import generateRandomMatch from "utils/admin/channel/generateRandomMatch";
import useCreateGamePairs from "hooks/admin/game/useCreateGamePairs";
import { alertErrorMessage } from "utils/error";
import useSearchGames from "hooks/admin/game/useSearchGames";
import GameContainer from "./GameContainer";
import { Game } from "interfaces/game";
import { useQueryClient } from "@tanstack/react-query";
import { GET_SEARCH_GAMES } from "constants/admin/queryKeys";

interface Props {
  createdGroups: Group[];
}

const MatchManagement = ({ createdGroups }: Props) => {
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<Group>(createdGroups[0]);
  const [gameList, setGameList] = useState<Game[]>([]);
  const { mutate: createGamePairsSync, mutateAsync: createGamePairsAsync } =
    useCreateGamePairs();

  // 선택된 그룹에 해당하는 게임 데이터를 가져옴
  const {
    data: fetchedGames,
    triggerQuery,
    refetch: refetchGames,
  } = useSearchGames(selectedGroup.id);

  const handleAllMatch = async () => {
    try {
      // createdGroups 배열의 각 그룹마다 자동 매칭 요청을 생성
      const mutationPromises = createdGroups.map(async (group) => {
        if (group.joined_users.length <= 1) {
          // 유저가 1명 이하이면 매칭 요청을 하지 않음
          return Promise.resolve(null);
        }
        const matchedUsers = generateRandomMatch(group.joined_users);

        const payload = {
          group_id: group.id,
          pointed_users: matchedUsers,
        };
        // mutateAsync를 사용하여 비동기 요청 실행
        return await createGamePairsAsync(payload);
      });

      // 모든 그룹에 대한 매칭 요청을 병렬로 실행
      await Promise.all(mutationPromises);

      await triggerQuery();
      await refetchGames();

      alert("모든 그룹의 자동 매치가 성공했습니다.");
    } catch (error) {
      alertErrorMessage(error);
    }
  };

  // createdGroups가 변경되면 첫 번째 그룹을 기본 선택
  useEffect(() => {
    if (createdGroups.length > 0) {
      setSelectedGroup(createdGroups[0]);
    }
  }, [createdGroups]);

  // 선택된 그룹이 바뀌면 게임 데이터를 다시 가져옴
  useEffect(() => {
    if (selectedGroup) {
      triggerQuery();
    }
  }, [selectedGroup, triggerQuery]);

  // 불러온 게임 데이터를 gameList 상태에 반영
  useEffect(() => {
    setGameList(fetchedGames || []);
  }, [fetchedGames]);

  // 그룹 변경 핸들러
  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = Number(event.target.value);
    const group = createdGroups.find((g) => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  // 자동매치 핸들러
  const handleMatch = () => {
    const users = selectedGroup.joined_users;
    if (users.length <= 1) {
      alert("유저가 부족하여 매칭을 생성할 수 없습니다.");
      return;
    }
    const matchedUsers = generateRandomMatch(users);

    const payload = {
      group_id: selectedGroup.id,
      pointed_users: matchedUsers,
    };
    createGamePairsSync(payload, {
      onSuccess: (data: Game[]) => {
        setGameList(data);
        alert("자동 매치를 성공했습니다");
        queryClient.refetchQueries({
          queryKey: [GET_SEARCH_GAMES, String(selectedGroup.id)],
        });
      },
      onError: (error) => alertErrorMessage(error),
    });
  };

  // 유저 정렬 (여성과 남성 분리)
  const { sortedFemaleUsers, sortedMaleUsers } = useMemo(() => {
    const sorted = [...selectedGroup.joined_users].sort((a, b) => {
      if (a.gender !== b.gender) {
        return a.gender === "female" ? -1 : 1;
      }
      return b.birth_year - a.birth_year;
    });
    return {
      sortedFemaleUsers: sorted.filter((user) => user.gender === "female"),
      sortedMaleUsers: sorted.filter((user) => user.gender === "male"),
    };
  }, [selectedGroup.joined_users]);

  return (
    <Section>
      <FilterContainer>
        <Title>매치 관리</Title>
        <SelectWrapper>
          <Select value={selectedGroup.id} onChange={handleGroupChange}>
            {createdGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
              </option>
            ))}
          </Select>
        </SelectWrapper>
        <ActionButton onClick={handleAllMatch}>
          <FaRandom />
          게임 자동으로 매치하기
        </ActionButton>
      </FilterContainer>

      <GroupCard>
        <GroupHeader>
          <GroupName>{selectedGroup.group_name}</GroupName>
        </GroupHeader>
        {selectedGroup.joined_users.length === 0 ? (
          <EmptyUsersMessage>
            해당 그룹에는 등록된 유저가 없습니다.
          </EmptyUsersMessage>
        ) : (
          <>
            <SectionTitle>여성</SectionTitle>
            <UserList>
              {sortedFemaleUsers.map(({ id, user_name, birth_year }) => (
                <UserItem key={id}>
                  <Gender>🙋‍♀️</Gender>
                  <Info>
                    <UserName>{`${id} • ${user_name}`}</UserName>
                    <Details>
                      여성 • {birth_year ? birth_year : "나이 미공개"}
                    </Details>
                  </Info>
                </UserItem>
              ))}
            </UserList>

            <SectionTitle>남성</SectionTitle>
            <UserList>
              {sortedMaleUsers.map(({ id, user_name, birth_year }) => (
                <UserItem key={id}>
                  <Gender>🙋‍♂️</Gender>
                  <Info>
                    <UserName>{`${id} • ${user_name}`}</UserName>
                    <Details>
                      남성 • {birth_year ? birth_year : "나이 미공개"}
                    </Details>
                  </Info>
                </UserItem>
              ))}
            </UserList>
          </>
        )}
      </GroupCard>

      <MatchedButtonContainer>
        <MatchedButton
          onClick={handleMatch}
          disabled={selectedGroup.joined_users.length <= 1}
        >
          자동 매치 <FaRandom style={{ marginLeft: "8px" }} />
        </MatchedButton>
      </MatchedButtonContainer>

      <GameContainer
        gameList={gameList}
        setGameList={setGameList}
        joinedUsers={selectedGroup.joined_users}
      />
    </Section>
  );
};

export default MatchManagement;

const Section = styled.section`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #222;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 250px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const GroupCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 1.5rem;
  padding-bottom: 1rem;
`;

const GroupHeader = styled.div`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupName = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
`;

const EmptyUsersMessage = styled.p`
  font-size: 1.2rem;
  color: #777;
  text-align: center;
  padding: 1.5rem;
`;

const SectionTitle = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #222;
`;

const UserList = styled.div`
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 4px;
  margin-left: 1rem;
`;

const UserName = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #222;
`;

const Gender = styled.div`
  font-size: 2rem;
`;

const Details = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const MatchedButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
`;

const MatchedButton = styled.button`
  background-color: #16a34a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: #15803d;
  }
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1e3a8a;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #162e6e;
  }
`;
