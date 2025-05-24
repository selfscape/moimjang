import { Group } from "interfaces/group";

const findMyGroup = (userId: number, groups: Array<Group>): string | null => {
  for (const group of groups) {
    if (group.joined_users.some((user) => user.id === userId)) {
      return group.group_name;
    }
  }
  return null; // 그룹을 찾지 못한 경우 null 반환
};

export default findMyGroup;
