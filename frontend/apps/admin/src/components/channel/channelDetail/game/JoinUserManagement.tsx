import styled from "styled-components";
import { useDrag } from "react-dnd";
import { PARTICIPANT } from "constants/dnd";
import { User } from "interfaces/user";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import useDeleteChannelUser from "hooks/users/useDeleteChannelUser";

import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useSystemModal from "hooks/common/components/useSystemModal";
import { USER_NAME } from "configs";

interface Props {
  users: Array<User>;
  refetchUsersNotInGroup: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User[], Error>>;
}

const JoinUserManagement = ({ users, refetchUsersNotInGroup }: Props) => {
  // Filter users by gender
  const maleUsers = users?.filter((user) => user.gender === "male");
  const femaleUsers = users?.filter((user) => user.gender === "female");

  const handleRefresh = async () => {
    await refetchUsersNotInGroup();
  };

  // Sort users by birth year (oldest first)
  const sortByAge = (a: User, b: User) => {
    const ageA = new Date().getFullYear() - (a.birth_year || 0);
    const ageB = new Date().getFullYear() - (b.birth_year || 0);
    return ageB - ageA;
  };

  const sortedMaleUsers = maleUsers?.sort(sortByAge);
  const sortedFemaleUsers = femaleUsers?.sort(sortByAge);

  const renderUserCard = (member: User) => {
    return (
      <Participant
        key={member.id}
        user={member}
        refetchUsersNotInGroup={refetchUsersNotInGroup}
      />
    );
  };

  const hasUsersNotInGroup = !!users?.length;

  return (
    <Section id="member-management">
      <SectionHeader>
        <Title>참여 멤버 관리</Title>
        <ActionButton onClick={handleRefresh}>새로 고침</ActionButton>
      </SectionHeader>

      {!hasUsersNotInGroup && (
        <NoUsersMessage>유저가 존재하지 않습니다.</NoUsersMessage>
      )}

      {/* Male Users Section */}
      {hasUsersNotInGroup && sortedMaleUsers.length > 0 && (
        <SubSection>
          <SubTitle>남자 멤버</SubTitle>
          <Grid>{sortedMaleUsers.map(renderUserCard)}</Grid>
        </SubSection>
      )}

      {/* Female Users Section */}
      {hasUsersNotInGroup && sortedFemaleUsers.length > 0 && (
        <SubSection>
          <SubTitle>여자 멤버</SubTitle>
          <Grid>{sortedFemaleUsers.map(renderUserCard)}</Grid>
        </SubSection>
      )}
    </Section>
  );
};

const Participant = ({
  user,
  refetchUsersNotInGroup,
}: {
  user: User;
  refetchUsersNotInGroup: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User[], Error>>;
}) => {
  const { channelId } = useParams();
  const { mutate: deleteChannelUser } = useDeleteChannelUser();
  const { openModal, showErrorModal, showAnyMessageModal } = useSystemModal();

  const owner = localStorage.getItem(USER_NAME);
  const isTester = owner === "tester";

  const [{ isDragging }, drag] = useDrag(() => ({
    type: PARTICIPANT,
    item: { type: PARTICIPANT, userId: user.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const handleDeleteUserButtonClick = (user_id: number, username: string) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    openModal({
      isOpen: true,
      title: `${username}님을 소셜링에서 내보내시겠어요?`,
      message: "내보낸 유저는 참여한 소셜링에서 제외 됩니다.",
      confirmText: "내보내기",
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        deleteChannelUser(
          { user_id, channel_id: channelId },
          {
            onSuccess: async () => {
              await refetchUsersNotInGroup();
            },
            onError: (error) => {
              const errorDetails = error.response.data as { detail: string };
              showErrorModal(errorDetails.detail);
            },
          }
        );
      },
    });
  };

  return (
    <Card ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <InfoContainer>
        <IconWrapper>{user.gender === "male" ? "🙋‍♂️" : "🙋‍♀️"}</IconWrapper>
        <div>
          <Name hasInfo={!!user.username}>{user.username || "정보없음"}</Name>
          <Details>
            {user.birth_year ? `${user.birth_year}` : "정보없음"} ·{" "}
            {user.gender === "male" ? "남자" : "여자"}
          </Details>
        </div>
      </InfoContainer>
      <FaTrash
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteUserButtonClick(user.id, user.username);
        }}
        style={{
          cursor: "pointer",
        }}
      />
    </Card>
  );
};

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1.2rem;
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

const Section = styled.section`
  margin-bottom: 2rem;
  background-color: #f9fafb;
  padding: 2rem;
  border-radius: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e3a8a;
`;

const SubSection = styled.div`
  margin-bottom: 2rem;
`;

const SubTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4a90e2;
`;

const NoUsersMessage = styled.p`
  font-size: 1rem;
  text-align: center;
  color: #6b7280;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1.5rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: grab;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  font-size: 2.5rem;
`;

const Name = styled.p<{ hasInfo: boolean }>`
  font-weight: 600;
  color: ${({ hasInfo }) => (hasInfo ? "inherit" : "#9ca3af")};
`;

const Details = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export default JoinUserManagement;
