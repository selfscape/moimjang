import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

export enum BrandSection {
  MANAGEMENT = "MANAGEMENT",
  REVIEW = "REVIEW",
  QUESTION_CARD = "QUESTION_CARD",
  SURVEY_FORM = "SURVEY_FORM",
}

interface SectionToggleProps {
  onSelect?: (section: BrandSection) => void;
}

const SectionToggle: React.FC<SectionToggleProps> = ({ onSelect }) => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  const [activeSection, setActiveSection] = useState<BrandSection>(
    BrandSection.MANAGEMENT
  );

  const handleSelect = (section: BrandSection) => {
    setActiveSection(section);
    if (onSelect) {
      onSelect(section);
    }
  };

  return (
    <ToggleContainer>
      <ToggleButton
        active={activeSection === BrandSection.MANAGEMENT}
        onClick={() => handleSelect(BrandSection.MANAGEMENT)}
      >
        브랜드 관리
      </ToggleButton>

      <ToggleButton
        active={activeSection === BrandSection.REVIEW}
        onClick={() => handleSelect(BrandSection.REVIEW)}
        disabled={!isEditMode}
      >
        후기 관리
      </ToggleButton>
      <ToggleButton
        active={activeSection === BrandSection.SURVEY_FORM}
        onClick={() => handleSelect(BrandSection.SURVEY_FORM)}
        disabled={!isEditMode}
      >
        설문 폼 관리
      </ToggleButton>
      <ToggleButton
        active={activeSection === BrandSection.QUESTION_CARD}
        onClick={() => handleSelect(BrandSection.QUESTION_CARD)}
        disabled={!isEditMode}
      >
        질문카드 관리
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
    background-color: ${({ theme: { palette }, active }) =>
      active ? palette.grey700 : "#d1d5db"};
  }

  &:disabled {
    color: ${({ theme: { palette } }) => palette.grey400};
    background-color: ${({ theme: { palette } }) => palette.grey100};
  }
`;
