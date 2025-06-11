import { Game } from "interfaces/game";
import { JoinedUser } from "interfaces/group";

export interface StructuredGame {
  id: number;
  group_id: number;
  userInfo: JoinedUser | null;
  matchedUserInfo: JoinedUser | null;
  created_at: string;
}

const structureGameData = (
  gameList: Game[],
  joinedUsers: JoinedUser[]
): StructuredGame[] => {
  return gameList.map((game) => {
    const user =
      joinedUsers.find((user) => Number(user.id) === game.user_id) || null;
    const matchedUser =
      joinedUsers.find((user) => Number(user.id) === game.matched_user_id) ||
      null;

    return {
      id: game.id,
      group_id: game.group_id,
      userInfo: user,
      matchedUserInfo: matchedUser,
      created_at: game.created_at,
    };
  });
};

export default structureGameData;
