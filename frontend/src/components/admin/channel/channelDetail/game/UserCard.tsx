import React from "react";
import styled from "styled-components";
import { JoinedUser } from "interfaces/group";

interface UserCardProps {
  user: JoinedUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card>
      <Avatar>{user.gender === "male" ? "🙋‍♂️" : "🙋‍♀️"}</Avatar>
      <Info>
        <Name>{user.user_name}</Name>
        <BirthYear>{user.birth_year}년생</BirthYear>
      </Info>
    </Card>
  );
};

export default UserCard;

// Styled components
const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  max-width: 300px;
  width: 100%;
`;

const Avatar = styled.span`
  font-size: 2rem;
  margin-right: 1rem;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const BirthYear = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;
