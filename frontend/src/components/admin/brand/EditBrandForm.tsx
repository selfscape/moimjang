import { useState } from "react";
import styled from "styled-components";

import QuestionCardSection from "./questionCard/QuestionCardSection";
import SectionToggle, { BrandSection } from "./SectionToggle";
import ManagementSection from "./management";
import SurveyFormSection from "./surveyForm";
import ReviewSection from "./review";

const EidtBrandForm = () => {
  const [brandSection, setBrandSection] = useState<BrandSection>(
    BrandSection.MANAGEMENT
  );

  return (
    <Container>
      <SectionToggle
        onSelect={(section: BrandSection) => {
          setBrandSection(section);
        }}
      />
      {brandSection === BrandSection.MANAGEMENT && <ManagementSection />}
      {brandSection === BrandSection.REVIEW && <ReviewSection />}
      {brandSection === BrandSection.SURVEY_FORM && <SurveyFormSection />}
      {brandSection === BrandSection.QUESTION_CARD && <QuestionCardSection />}
    </Container>
  );
};

export default EidtBrandForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  background-color: #fff;

  min-height: 1200px;
  padding-bottom: 300px;
`;
