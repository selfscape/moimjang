import React from "react";
import styled from "styled-components";
import { FaDeleteLeft } from "react-icons/fa6";
import { StructuredGame } from "utils/channel/structureGameData";
import useDeleteGame from "hooks/game/useDeleteGame";
import { Game } from "interfaces/game";

interface GameCardProps {
  game: StructuredGame;
  setGameList: React.Dispatch<React.SetStateAction<Array<Game>>>;
}

const GameCard: React.FC<GameCardProps> = ({ game, setGameList }) => {
  const { mutate: deleteGame } = useDeleteGame();

  const handleDelete = (id: number) => {
    deleteGame(String(id), {
      onSuccess: () => {
        setGameList((prev) => prev.filter((game) => game.id !== id));
      },
    });
  };
  return (
    <Card>
      {/* 삭제 버튼 */}
      <DeleteButton onClick={() => handleDelete(game.id)}>
        <FaDeleteLeft size={18} />
      </DeleteButton>

      {/* 유저 정보 */}
      <UserInfo gender={game.userInfo?.gender}>
        <Avatar gender={game.userInfo?.gender}>
          {game.userInfo?.user_name?.charAt(0)}
        </Avatar>
        <div>
          <UserName>{game.userInfo?.user_name}</UserName>
          <UserDetails>
            {game.userInfo?.gender === "male" ? "남성" : "여성"} ·{" "}
            {game.userInfo?.birth_year}년생
          </UserDetails>
        </div>
      </UserInfo>

      {/* 화살표 아이콘 */}
      <Arrow>→</Arrow>

      {/* 매칭된 유저 정보 */}
      <UserInfo gender={game.matchedUserInfo?.gender}>
        <div>
          <UserName>{game.matchedUserInfo?.user_name || "미정"}</UserName>
          <UserDetails>
            {game.matchedUserInfo
              ? `${
                  game.matchedUserInfo.gender === "male" ? "남성" : "여성"
                } · ${game.matchedUserInfo.birth_year}년생`
              : "정보 없음"}
          </UserDetails>
        </div>
        <Avatar gender={game.matchedUserInfo?.gender}>
          {game.matchedUserInfo?.user_name?.charAt(0) || "?"}
        </Avatar>
      </UserInfo>
    </Card>
  );
};

export default GameCard;

/* Styled Components */
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #555;
  }
`;

const UserInfo = styled.div<{ gender?: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div<{ gender?: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border-radius: 50%;
  background-color: ${({ gender }) =>
    gender === "male" ? "#4A90E2" : "#FF6B81"};
`;

const UserName = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const UserDetails = styled.p`
  font-size: 14px;
  color: #666;
`;

const Arrow = styled.div`
  font-size: 20px;
  color: #777;
`;
