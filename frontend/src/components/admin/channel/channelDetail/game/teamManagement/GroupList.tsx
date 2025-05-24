import styled from "styled-components";
import GroupCard from "./GroupCard";
import { Group } from "interfaces/group";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { User } from "interfaces/user";

interface Props {
  groups: Array<Group>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Group[], Error>>;
  refetchUsersNotInGroup: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User[], Error>>;
}

const GroupList = ({ groups, refetch, refetchUsersNotInGroup }: Props) => {
  if (!groups?.length) return <>그룹이 존재하지 않습니다</>;

  return (
    <Container>
      {groups?.map((group) => (
        <GroupCard
          group={group}
          refetch={refetch}
          refetchUsersNotInGroup={refetchUsersNotInGroup}
          key={group.id}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export default GroupList;
