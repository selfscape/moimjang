import { useDrag } from "react-dnd";
import { FaRegTrashAlt } from "react-icons/fa";
import { JOINED_PARTICIPANT, PARTICIPANT } from "constants/admin/dnd";
import styled from "styled-components";
import { JoinedUser } from "interfaces/group/index";

interface User {
  id: number;
  user_name: string;
  gender: "male" | "female";
  birth_year?: number;
}

interface Props {
  users: JoinedUser[];
  groupId: number;
  handleDeleteUserClick: (group_id: number, user_id: number) => void;
}

const JoinedUserList = ({ users, groupId, handleDeleteUserClick }: Props) => {
  // 남자와 여자를 성별로 구분
  const maleUsers = users.filter((user) => user.gender === "male");
  const femaleUsers = users.filter((user) => user.gender === "female");

  // 연령대 기준으로 정렬
  const sortedMaleUsers = maleUsers.sort(
    (a, b) => (a.birth_year ?? 0) - (b.birth_year ?? 0)
  );
  const sortedFemaleUsers = femaleUsers.sort(
    (a, b) => (a.birth_year ?? 0) - (b.birth_year ?? 0)
  );

  return (
    <ListContainer>
      <Section>
        <Title>남자 ({sortedMaleUsers.length})</Title>
        {sortedMaleUsers.map((user) => (
          <User
            key={user.id}
            user={user}
            groupId={groupId}
            handleDeleteUserClick={handleDeleteUserClick}
          />
        ))}
      </Section>
      <Section>
        <Title>여자 ({sortedFemaleUsers.length})</Title>
        {sortedFemaleUsers.map((user) => (
          <User
            key={user.id}
            user={user}
            groupId={groupId}
            handleDeleteUserClick={handleDeleteUserClick}
          />
        ))}
      </Section>
    </ListContainer>
  );
};

const User = ({
  user,
  groupId,
  handleDeleteUserClick,
}: {
  user: JoinedUser;
  groupId: number;
  handleDeleteUserClick: (group_id: number, user_id: number) => void;
}) => {
  const [{ isDragging }, dragMember] = useDrag(() => ({
    type: JOINED_PARTICIPANT,
    item: { userId: user.id, groupId: groupId, type: JOINED_PARTICIPANT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <UserContainer ref={dragMember} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Gender>{user.gender === "male" ? "🙋‍♂️" : "🙋‍♀️"}</Gender>
      <Info>
        <Name>{user.user_name}</Name>
        <Details>
          {user.gender === "male" ? "남성" : "여성"} •{" "}
          {user.birth_year ? `${user.birth_year}` : "나이 미공개"}
        </Details>
      </Info>
      <FaRegTrashAlt
        onClick={() => handleDeleteUserClick(groupId, Number(user.id))}
        style={{
          cursor: "pointer",
        }}
      />
    </UserContainer>
  );
};

export default JoinedUserList;

const ListContainer = styled.div``;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  gap: 4px;
  margin-left: 1rem;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
`;

const Details = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

const Gender = styled.div`
  font-size: 2rem;
`;
