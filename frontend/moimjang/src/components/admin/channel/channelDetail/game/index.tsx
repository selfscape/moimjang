import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { ChannelFeatureButton } from "constants/common";
import useSearchGroups from "hooks/admin/group/useSearchGroups";
import useGetUsersNotInGroup from "hooks/admin/users/useGetUsersNotInGroup";
import { useChannelFormContext } from "hooks/admin/channel/context/useChannelFormContext";

import JoinUserManagement from "components/admin/channel/channelDetail/game/JoinUserManagement";
import GroupManagement from "components/admin/channel/channelDetail/game/teamManagement";
import MatchManagement from "components/admin/channel/channelDetail/game/matchManagement";

const Game: React.FC = () => {
  const { channelId } = useParams<{ channelId?: string }>();
  const { channelData, isEditMode, formData, setFormData } =
    useChannelFormContext();

  const {
    data: groups,
    refetch,
    triggerQuery,
  } = useSearchGroups(isEditMode && channelId ? Number(channelId) : 0);
  const { data: usersNotInGroup, refetch: refetchUsersNotInGroup } =
    useGetUsersNotInGroup();

  const handleCheckboxChange = (value: ChannelFeatureButton) => {
    setFormData((prevData) => {
      const updatedComponents = prevData.visible_components.includes(value)
        ? prevData.visible_components.filter((item) => item !== value)
        : [...prevData.visible_components, value];
      return { ...prevData, visible_components: updatedComponents };
    });
  };

  useEffect(() => {
    if (isEditMode && channelId) {
      triggerQuery();
    }
  }, [isEditMode, channelId, triggerQuery]);

  return (
    <Container>
      <h2 style={{ marginBottom: "32px" }}>버튼 노출 설정</h2>
      <Grid>
        {[
          { label: "그룹보기", value: ChannelFeatureButton.GROUP },
          { label: "첫인상 게임", value: ChannelFeatureButton.MATCHLOG },
          { label: "컨텐츠 박스", value: ChannelFeatureButton.QUESTION_CARD },
          { label: "리뷰남기기", value: ChannelFeatureButton.REVIEW_FORM },
          { label: "후기보기", value: ChannelFeatureButton.REVIEW_LIST },
          { label: "후기 작성하기", value: ChannelFeatureButton.WRITE_REVIEW },
        ].map((data, index) => (
          <CheckboxWrapper key={index}>
            <span>{data.label}</span>
            <Checkbox onClick={() => handleCheckboxChange(data.value)}>
              <input
                type="checkbox"
                checked={formData.visible_components.includes(data.value)}
                onChange={() => handleCheckboxChange(data.value)}
                className="sr-only peer"
              />
              <div className="switch"></div>
            </Checkbox>
          </CheckboxWrapper>
        ))}
      </Grid>

      {isEditMode && (
        <>
          <JoinUserManagement
            users={usersNotInGroup}
            refetchUsersNotInGroup={refetchUsersNotInGroup}
          />
          <GroupManagement
            channelId={channelId}
            joinedUsers={channelData?.joined_users}
            groupList={groups}
            refetch={refetch}
            refetchUsersNotInGroup={refetchUsersNotInGroup}
          />
          {groups && groups.length > 0 && (
            <MatchManagement createdGroups={groups} />
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div``;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const Checkbox = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .switch {
    width: 2.75rem;
    height: 1.5rem;
    background-color: #e5e7eb;
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.2s;
  }

  input:checked + .switch {
    background-color: ${({ theme }) => theme.palette.grey700};
  }

  .switch::after {
    content: "";
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
    transition: transform 0.2s;
  }

  input:checked + .switch::after {
    transform: translate(1.25rem, -50%);
  }
`;

export default Game;
