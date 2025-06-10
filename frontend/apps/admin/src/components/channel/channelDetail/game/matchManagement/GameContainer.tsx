import { useMemo } from "react";
import styled from "styled-components";
import { Game } from "interfaces/game";
import structureGameData, {
  StructuredGame,
} from "utils/channel/structureGameData";
import { JoinedUser } from "interfaces/group";
import GameCard from "./GameCard";
import matchValidation from "utils/channel/matchValidation";
import useDeleteGame from "hooks/game/useDeleteGame";
import { OWNER } from "configs";
import useSystemModal from "hooks/common/components/useSystemModal";

interface Props {
  gameList: Array<Game>;
  joinedUsers: Array<JoinedUser>;
  setGameList: React.Dispatch<React.SetStateAction<Array<Game>>>;
}

const GameContainer = ({ gameList, setGameList, joinedUsers }: Props) => {
  const { mutateAsync: deleteGame } = useDeleteGame();
  const { showAnyMessageModal } = useSystemModal();

  const owner = localStorage.getItem(OWNER);
  const isTester = owner === "tester";

  // gameList나 joinedUsers가 없으면 파생 상태 계산하지 않음
  const structuredGame = useMemo<StructuredGame[]>(() => {
    if (!gameList?.length || !joinedUsers?.length) return [];
    return structureGameData(gameList, joinedUsers);
  }, [gameList, joinedUsers]);

  const isMatchValid = useMemo<boolean>(() => {
    if (!gameList?.length || !joinedUsers?.length) return true;
    return matchValidation(gameList, joinedUsers, structuredGame);
  }, [gameList, joinedUsers, structuredGame]);

  const handleDeleteButtonClick = async () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    try {
      await Promise.all(gameList.map((game) => deleteGame(String(game.id))));
      // 삭제 후 부모 상태를 비움
      setGameList([]);
    } catch (error) {
      console.log(error);
    }
  };

  // gameList가 없으면 빈 상태 UI 표시
  if (!gameList || gameList.length === 0) {
    return (
      <Container>
        <Title>매칭 리스트</Title>
        <EmptyMessage>매칭된 정보가 없습니다.</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>매칭 리스트</Title>

      {/* 매칭 상태가 유효하지 않을 때만 경고 메시지 노출 */}
      {!isMatchValid && (
        <WarningMessage>
          <WarningIcon>⚠️</WarningIcon> 생성된 매치를 모두 삭제한 후, 자동
          매치를 다시 클릭해야 합니다.
          <button onClick={handleDeleteButtonClick}>삭제하기</button>
        </WarningMessage>
      )}

      <GameList>
        {structuredGame.map((game) => (
          <GameCard key={game.id} game={game} setGameList={setGameList} />
        ))}
      </GameList>
    </Container>
  );
};

export default GameContainer;

const Container = styled.div`
  padding: 40px 30px;
  background-color: #f4f6f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 40px auto;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  padding: 0 20px;
`;

const WarningMessage = styled.div`
  font-size: 18px;
  color: #d9534f;
  margin-bottom: 24px;
  background-color: #f8d7da;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  border: 1px solid #f5c6cb;
`;

const WarningIcon = styled.span`
  font-size: 20px;
`;

const EmptyMessage = styled.p`
  font-size: 20px;
  color: #555;
  text-align: center;
  padding: 40px 0;
`;
