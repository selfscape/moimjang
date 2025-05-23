import styled from "styled-components";
import { useDrop } from "react-dnd";
import { FaTrash } from "react-icons/fa";
import { JOINED_PARTICIPANT, PARTICIPANT } from "constants/admin/dnd";

import { Group } from "interfaces/group";
import useDeleteGroup from "hooks/admin/group/useDeleteGroup";
import useAddUsersToGroup from "hooks/admin/group/useAddUsersToGroup";
import useDeleteUserToGroup from "hooks/admin/group/useDeleteUserToGroup";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { alertErrorMessage } from "utils/error";
import JoinedUserList from "./JoinedUserList";
import useEditUserToGroup from "hooks/admin/group/useEditUserToGroup";
import { User } from "interfaces/user";

interface Props {
  group: Group;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Group[], Error>>;
  refetchUsersNotInGroup: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User[], Error>>;
}

const GroupCard = ({ group, refetch, refetchUsersNotInGroup }: Props) => {
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: deleteUserToGroup } = useDeleteUserToGroup();
  const { mutate: addUsersToGroup } = useAddUsersToGroup();
  const { mutate: editUserToGroup } = useEditUserToGroup();

  const handleDeleteGroup = (groupId: number) => {
    deleteGroup(groupId, {
      onSuccess: () => {
        refetch();
        refetchUsersNotInGroup();
      },
    });
  };

  const handleDeleteUserClick = (group_id: number, user_id: number) => {
    deleteUserToGroup(
      { group_id, user_id },
      {
        onSuccess: () => {
          refetch();
          refetchUsersNotInGroup();
        },
        onError: (error) => alertErrorMessage(error),
      }
    );
  };

  const [{}, dropParticipant] = useDrop(() => ({
    accept: [PARTICIPANT, JOINED_PARTICIPANT],
    drop: (
      item: {
        userId: string;
        groupId: string;
        gender: string;
        userName: string;
        birthYear: string;
      },
      monitor
    ) => {
      const user_id = Number(item.userId);
      const group_id = Number(item.groupId);
      const type = monitor.getItemType();

      if (type === PARTICIPANT) {
        addUsersToGroup(
          {
            group_id: group.id,
            requestBody: { user_id_list: [user_id] },
          },
          {
            onSuccess: () => {
              refetch();
              refetchUsersNotInGroup();
            },
            onError: (error) => alertErrorMessage(error),
          }
        );
      }

      if (type === JOINED_PARTICIPANT) {
        editUserToGroup(
          {
            group_id,
            user_id,
            requestBody: { target_group_id: group.id },
          },
          {
            onSuccess: () => {
              refetch();
              refetchUsersNotInGroup();
            },
            onError: (error) => alertErrorMessage(error),
          }
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      dropTargetInfo: monitor.getDropResult(),
    }),
  }));

  return (
    <Container ref={dropParticipant}>
      <Header>
        <Title>{group.group_name}</Title>
        <FaTrash
          onClick={() => handleDeleteGroup(group.id)}
          style={{ cursor: "pointer" }}
        />
      </Header>
      {group.joined_users.length > 0 && (
        <JoinedUserList
          users={group.joined_users}
          groupId={group.id}
          handleDeleteUserClick={handleDeleteUserClick}
        />
      )}
    </Container>
  );
};

export default GroupCard;

const Container = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
`;
