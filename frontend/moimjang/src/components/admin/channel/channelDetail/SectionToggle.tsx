import { useChannelFormContext } from "hooks/admin/channel/context/useChannelFormContext";
import React, { useState } from "react";
import styled from "styled-components";

export enum ChannelSection {
  SOCIALING = "SOCIALING",
  GAME = "GAME",
  APPLICATION = "APPLICATION",
}

interface SectionToggleProps {
  onSelect?: (section: ChannelSection) => void;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ onSelect }) => {
  const { isEditMode } = useChannelFormContext();

  const [activeSection, setActiveSection] = useState<ChannelSection>(
    ChannelSection.SOCIALING
  );

  const handleSelect = (section: ChannelSection) => {
    setActiveSection(section);
    if (onSelect) {
      onSelect(section);
    }
  };

  return (
    <ToggleContainer>
      <ToggleButton
        active={activeSection === ChannelSection.SOCIALING}
        onClick={() => handleSelect(ChannelSection.SOCIALING)}
      >
        소셜링 관리
      </ToggleButton>
      <ToggleButton
        active={activeSection === ChannelSection.APPLICATION}
        onClick={() => handleSelect(ChannelSection.APPLICATION)}
        disabled={!isEditMode}
      >
        신청 관리
      </ToggleButton>
      <ToggleButton
        active={activeSection === ChannelSection.GAME}
        onClick={() => handleSelect(ChannelSection.GAME)}
        disabled={!isEditMode}
      >
        게임 관리
      </ToggleButton>
    </ToggleContainer>
  );
};

export default SectionToggle;

const ToggleContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  background-color: ${({ active, theme: { palette } }) =>
    active ? palette.grey700 : "#e5e7eb"};
  color: ${(props) => (props.active ? "#fff" : "#374151")};
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ active, theme: { palette } }) =>
      active ? palette.grey700 : "#e5e7eb"};
  }

  &:disabled {
    color: ${({ theme: { palette } }) => palette.grey400};
    background-color: ${({ theme: { palette } }) => palette.grey100};
  }
`;
