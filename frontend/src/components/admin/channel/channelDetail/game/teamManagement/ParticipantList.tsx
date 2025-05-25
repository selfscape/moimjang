import { JoinedUser } from "interfaces/group";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { PARTICIPANT } from "constants/admin/dnd";

const ParticipantList = ({ users }: { users?: JoinedUser[] }) => {
  const validUsers = users || [];

  const sortByAge = (a: JoinedUser, b: JoinedUser) => {
    const ageA = new Date().getFullYear() - (a.birth_year || 0);
    const ageB = new Date().getFullYear() - (b.birth_year || 0);
    return ageB - ageA;
  };

  const maleUsers = validUsers
    .filter((user) => user.gender === "male")
    .sort(sortByAge);
  const femaleUsers = validUsers
    .filter((user) => user.gender === "female")
    .sort(sortByAge);

  return (
    <Container>
      <Section>
        <Title>남자 ({maleUsers.length})</Title>
        {maleUsers.length === 0 ? (
          <NoParticipants>참여자가 없습니다.</NoParticipants>
        ) : (
          maleUsers.map((user) => <Participant key={user.id} user={user} />)
        )}
      </Section>
      <Section>
        <Title>여자 ({femaleUsers.length})</Title>
        {femaleUsers.length === 0 ? (
          <NoParticipants>참여자가 없습니다.</NoParticipants>
        ) : (
          femaleUsers.map((user) => <Participant key={user.id} user={user} />)
        )}
      </Section>
    </Container>
  );
};
const Participant = ({ user }: { user: JoinedUser }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: PARTICIPANT,
    item: {
      type: PARTICIPANT,
      userId: user.id,
      gender: user.gender,
      userName: user.user_name,
      birthYear: user.birth_year,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ParticipantContainer ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Wrapper>
        <Gender>{user.gender === "male" ? "🙋‍♂️" : "🙋‍♀️"}</Gender>
        <Info>
          <Name>{user.user_name}</Name>
          <Details>
            {user.gender === "male" ? "남성" : "여성"} •{" "}
            {user.birth_year ? `${user.birth_year}` : "나이 미공개"}
          </Details>
        </Info>
      </Wrapper>
    </ParticipantContainer>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const Section = styled.div`
  width: 48%;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ParticipantContainer = styled.div`
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 16px;
  cursor: move;
  margin-bottom: 8px;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;
`;

const Info = styled.div`
  margin-left: 0.75rem;
`;

const Name = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`;

const Details = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const Gender = styled.div`
  font-size: 40px;
`;

const NoParticipants = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-top: 10px;
`;

export default ParticipantList;
