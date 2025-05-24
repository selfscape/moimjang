import { JoinedUser } from "interfaces/group";

const generateRandomMatch = (
  selectedUsers: Array<JoinedUser>
): Array<[number, number]> => {
  const maxAttempts = 1000; // 무한 루프 방지를 위한 최대 시도 횟수
  let attempt = 0;
  let result: Array<[number, number]> = [];

  while (attempt < maxAttempts) {
    attempt++;
    let remainingUsers = [...selectedUsers];
    let pointedUsers: Array<[number, number]> = [];
    let pointedUsersSet = new Set<number>();

    // 각 사용자에 대해 매칭을 시도
    for (const pointingUser of selectedUsers) {
      const availableUsers = remainingUsers.filter(
        (user) => user.id !== pointingUser.id && !pointedUsersSet.has(user.id)
      );

      // 매칭할 사용자가 없으면 for문 탈출 (재시도를 위해)
      if (availableUsers.length === 0) {
        pointedUsers = [];
        break;
      }

      const randomUser =
        availableUsers[Math.floor(Math.random() * availableUsers.length)];
      pointedUsersSet.add(randomUser.id);
      pointedUsers.push([pointingUser.id, randomUser.id]);
      remainingUsers = remainingUsers.filter(
        (user) => user.id !== randomUser.id
      );
    }

    // 모든 사용자가 매칭되었으면 결과 저장 후 반복문 종료
    if (pointedUsers.length === selectedUsers.length) {
      result = pointedUsers;
      break;
    }
  }

  // 만약 maxAttempts 내에 유효한 매칭을 찾지 못하면 에러 발생
  if (result.length !== selectedUsers.length) {
    throw new Error("유효한 매칭을 생성할 수 없습니다.");
  }

  return result;
};

export default generateRandomMatch;
