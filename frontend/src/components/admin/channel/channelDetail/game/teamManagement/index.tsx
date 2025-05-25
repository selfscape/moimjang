import { Group, JoinedUser } from "interfaces/group";
import styled from "styled-components";
import { FaPlus, FaRandom } from "react-icons/fa";

import executeMatchMaking from "utils/admin/channel/executeMatchMaking";
import { alertErrorMessage } from "utils/error";
import useAddUsersToGroup from "hooks/admin/group/useAddUsersToGroup";
import useCreateGroup from "hooks/admin/group/useCreateGroup";
import GroupList from "./GroupList";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { User } from "interfaces/user";

interface Props {
  channelId: string;
  joinedUsers: Array<JoinedUser>;
  groupList: Array<Group>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Group[], Error>>;
  refetchUsersNotInGroup: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User[], Error>>;
}

const GroupManagement = ({
  channelId,
  joinedUsers,
  groupList,
  refetch,
  refetchUsersNotInGroup,
}: Props) => {
  const { mutateAsync: addUsersToGroup } = useAddUsersToGroup();
  const { mutate: createGroup } = useCreateGroup();

  const handleCreateGroup = (channel_id: number, group_name: string) => {
    createGroup(
      { channel_id, group_name },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const handleAutoMatchingButtonClick = async () => {
    if (!groupList?.length) return alert("그룹을 생성해 주세요");

    const hasJoinedUser = groupList.some(
      (group) => group.joined_users.length > 0
    );
    if (hasJoinedUser) return alert("그룹에 생성된 유저를 모두 제거해주세요");

    const result = executeMatchMaking(joinedUsers, groupList, channelId);

    try {
      await Promise.all(
        result.map((group) =>
          addUsersToGroup({
            group_id: group.id,
            requestBody: {
              user_id_list: group.joined_users.map((user) => Number(user.id)),
            },
          })
        )
      );
      await refetch();
      await refetchUsersNotInGroup();
    } catch (error) {
      alertErrorMessage(error);
    }
  };

  return (
    <Section>
      <Header>
        <Title>조 구성 관리</Title>
        <ButtonGroup>
          <ActionButton
            onClick={() =>
              handleCreateGroup(
                Number(channelId),
                `그룹 ${groupList.length + 1}`
              )
            }
          >
            <FaPlus /> 조 생성하기
          </ActionButton>
          <ActionButton onClick={handleAutoMatchingButtonClick}>
            <FaRandom /> 조 자동으로 매칭하기
          </ActionButton>
        </ButtonGroup>
      </Header>

      <GroupList
        groups={groupList}
        refetch={refetch}
        refetchUsersNotInGroup={refetchUsersNotInGroup}
      />
    </Section>
  );
};

export default GroupManagement;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f4f7fc;
  border-radius: 0.75rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1e3a8a;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #162e6e;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e3a8a;
`;
