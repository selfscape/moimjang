import { Group } from "@model/channel/group";

export const findMyGroup = (
  userId: number,
  groups: Array<Group>
): Group | null => {
  for (const group of groups) {
    if (group.joined_users.some((user) => user.id === userId)) {
      return group;
    }
  }
  return null;
};

export const getGenderEmoji = (gender: string): string => {
  if (gender === "male") return "🙋‍♂️";
  if (gender === "female") return "🙋‍♀️";
  return "";
};
