import { Game } from "interfaces/game";
import { JoinedUser } from "interfaces/group";

import { StructuredGame } from "./structureGameData";

const matchValidation = (
  gameList: Array<Game>,
  joinedUsers: Array<JoinedUser>,
  structuredGame: Array<StructuredGame>
): boolean => {
  if (gameList.length !== joinedUsers.length) {
    return false;
  }

  for (const game of structuredGame) {
    if (!game.userInfo || !game.matchedUserInfo) {
      return false;
    }
  }

  const joinedUserIds = new Set(joinedUsers.map((user) => user.id));

  for (const game of gameList) {
    if (
      !joinedUserIds.has(game.user_id) ||
      !joinedUserIds.has(game.matched_user_id)
    ) {
      return false;
    }
  }

  return true;
};

export default matchValidation;
