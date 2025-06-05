import React from "react";
import { JoinedUser } from "interfaces/group";
import UserCard from "./UserCard";
import styled from "styled-components";

interface UserListSectionProps {
  users: JoinedUser[];
  gender: "male" | "female";
}

const UserListSection: React.FC<UserListSectionProps> = ({ users, gender }) => {
  const filteredUsers = users.filter((user) => user.gender === gender);

  return (
    <Container>
      {filteredUsers.length > 0 && (
        <>
          <GenderTitle>{gender === "male" ? "남성" : "여성"}</GenderTitle>
          <UserList>
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </UserList>
        </>
      )}
    </Container>
  );
};

export default UserListSection;

const Container = styled.div`
  margin-bottom: 0.8rem;
`;

// Styled components
const GenderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const UserList = styled.div`
  display: flex;
  gap: 1rem;
`;
