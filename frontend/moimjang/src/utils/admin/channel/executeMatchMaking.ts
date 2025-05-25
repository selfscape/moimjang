import { Group, JoinedUser } from "interfaces/group";

const MAX_GROUP_SIZE = 8;

const executeMatchMaking = (
  joinedUsers: Array<JoinedUser>,
  groupList: Array<Group>,
  channelId: string
) => {
  const groupsCount = groupList.length;

  // 나이순 정렬 (숫자가 작은 순서대로 정렬)
  const sortedUsers = [...joinedUsers].sort(
    (a, b) => a.birth_year - b.birth_year // birth_year가 작은 순으로 정렬
  );
  const maleUsers = sortedUsers.filter((user) => user.gender === "male");
  const femaleUsers = sortedUsers.filter((user) => user.gender === "female");

  // 그룹당 평균 인원 계산
  const avgMalesPerGroup = Math.ceil(maleUsers.length / groupsCount);
  const avgFemalesPerGroup = Math.ceil(femaleUsers.length / groupsCount);

  // 그룹 초기화
  const groupedUsers: Array<{ male: number[]; female: number[] }> = Array.from(
    { length: groupsCount },
    () => ({
      male: [],
      female: [],
    })
  );

  // 사용자 배치 함수
  const distributeUsers = (
    users: JoinedUser[],
    key: "male" | "female",
    avgPerGroup: number
  ) => {
    let index = 0;
    while (users.length > 0) {
      const user = users.shift();
      if (user) {
        groupedUsers[index][key].push(Number(user.id)); // user.id를 그대로 사용

        if (
          groupedUsers[index].male.length + groupedUsers[index].female.length >=
          MAX_GROUP_SIZE
        ) {
          index = (index + 1) % groupsCount; // 그룹이 가득 차면 다음 그룹으로 이동
        } else if (groupedUsers[index][key].length >= avgPerGroup) {
          index = (index + 1) % groupsCount; // 그룹 내 성비 맞추기 위해 이동
        }
      }
    }
  };

  // 남녀별 분배
  distributeUsers(maleUsers, "male", avgMalesPerGroup);
  distributeUsers(femaleUsers, "female", avgFemalesPerGroup);

  const finalGroups: Array<Group> = groupedUsers.map((group, index) => ({
    id: groupList[index].id,
    channel_id: Number(channelId),
    group_name: groupList[index].group_name,
    created_at: groupList[index].created_at,
    joined_users: [
      ...group.male.map((userId) => {
        const user = joinedUsers.find((user) => user.id === userId);
        return user
          ? {
              id: user.id,
              user_name: user.user_name,
              gender: user.gender,
              birth_year: user.birth_year,
            }
          : null;
      }),
      ...group.female.map((userId) => {
        const user = joinedUsers.find((user) => user.id === userId);
        return user
          ? {
              id: user.id,
              user_name: user.user_name,
              gender: user.gender,
              birth_year: user.birth_year,
            }
          : null;
      }),
    ].filter(Boolean), // null 값 제거
  }));

  return finalGroups;
};

export default executeMatchMaking;
