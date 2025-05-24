import React, { useState } from "react";
import styled from "styled-components";

export enum LandingSection {
  MAIN_IMAGE = "MAIN_IMAGE",
  GALLERY = "GALLERY",
}

interface SectionToggleProps {
  onSelect?: (section: LandingSection) => void;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ onSelect }) => {
  const [activeSection, setActiveSection] = useState<LandingSection>(
    LandingSection.MAIN_IMAGE
  );

  const handleSelect = (section: LandingSection) => {
    setActiveSection(section);
    if (onSelect) {
      onSelect(section);
    }
  };

  return (
    <ToggleContainer>
      <ToggleButton
        active={activeSection === LandingSection.MAIN_IMAGE}
        onClick={() => handleSelect(LandingSection.MAIN_IMAGE)}
      >
        메인 썸네일 관리
      </ToggleButton>

      <ToggleButton
        active={activeSection === LandingSection.GALLERY}
        onClick={() => handleSelect(LandingSection.GALLERY)}
      >
        갤러리 이미지 관리
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
      active ? palette.grey700 : "#d1d5db"};
  }
`;
