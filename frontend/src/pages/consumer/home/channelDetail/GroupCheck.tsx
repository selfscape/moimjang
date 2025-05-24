import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaUsers } from "react-icons/fa";
import { useRecoilState } from "recoil";

import { Pathnames } from "constants/admin";
import useGetGroups from "hooks/consumer/useGetGroups";
import useHeader from "hooks/consumer/components/useHeader";
import { Group } from "interfaces/group";
import userState from "recoils/atoms/auth/userState";

import ConsumerLayout from "components/consumer/common/ConsumerLayout";

const findMyGroup = (userId: number, groups: Array<Group>): Group | null => {
  for (const group of groups) {
    if (group.joined_users.some((user) => user.id === userId)) {
      return group;
    }
  }
  return null;
};

const getGenderEmoji = (gender: string): string => {
  if (gender === "male") return "🙋‍♂️";
  if (gender === "female") return "🙋‍♀️";
  return "";
};

const GroupCheck: React.FC = () => {
  const [userData] = useRecoilState(userState);
  const { header } = useHeader();
  const { data, isLoading, error, refetch } = useGetGroups();
  const myGroup = userData?.id && data ? findMyGroup(userData.id, data) : null;
  const navigate = useNavigate();
  const { channelId } = useParams();

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  useEffect(() => {
    header({
      visible: true,
      title: "그룹 확인",
      onRefresh: refetch,
      onBack: handleBackButtonClick,
    });
  }, []);

  useEffect(() => {
    if (
      !userData?.joined_channel.id ||
      userData.joined_channel.id !== Number(channelId)
    ) {
      navigate(Pathnames.Home);
    }
  }, [data, userData, channelId]);

  if (isLoading) return;
  if (error) return;

  return (
    <ConsumerLayout>
      <Container hasGroup={!!myGroup}>
        <GroupStatus>
          <GroupInfo>
            <GroupIcon>
              <FaUsers size={24} />
            </GroupIcon>
            {myGroup ? (
              <GroupText>
                <h3>{myGroup?.group_name}</h3>
                <p>{myGroup?.joined_users.length}명</p>
              </GroupText>
            ) : (
              <GroupText>그룹지정 중입니다..</GroupText>
            )}
          </GroupInfo>
        </GroupStatus>
        {myGroup ? (
          <MembersSection>
            <h2>함께하는 멤버</h2>
            {myGroup.joined_users.map((member) => (
              <MemberCard key={member.id}>
                <MemberGender>{getGenderEmoji(member.gender)}</MemberGender>
                <MemberName>{member.user_name}</MemberName>
              </MemberCard>
            ))}
          </MembersSection>
        ) : (
          <></>
        )}
      </Container>
    </ConsumerLayout>
  );
};

const Container = styled.div<{ hasGroup: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ hasGroup }) => !hasGroup && "min-height: 100vh;"}
`;

const GroupStatus = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }
`;

const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const GroupIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const GroupText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111;
  }
  p {
    font-size: 1rem;
    color: #555;
  }
`;
const MembersSection = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1.5rem;
  }
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const MemberGender = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const MemberName = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #111;
`;

export default GroupCheck;
