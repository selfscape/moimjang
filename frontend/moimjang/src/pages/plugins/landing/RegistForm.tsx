import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaArrowLeft } from "react-icons/fa6";

import useGetLandingBrand from "api/landing/hook/useGetLandingBrand";
import { Pathnames } from "constants/admin";
import useGetSurveys from "hooks/landing/registerForm/useGetSurveys";
import useRegistForm from "hooks/landing/registerForm/useRegistForm";
import useSystemModal from "hooks/common/components/useSystemModal";
import useHeader from "hooks/landing/components/useHeader";
import { normalizeAnswers } from "utils/landing/registerForm/normalizedAnswers";
import { Survey } from "interfaces/landing";

import BrandingLayout from "components/landing/common/BrandingLayout";
import RenderQuestion from "components/landing/registForm/surveyType/RenderQuestion";

function isSurveyArray(value: any): value is Survey[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    Array.isArray(value[0].questions)
  );
}

function isAnswered(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

const RegistForm: React.FC = () => {
  const { header } = useHeader();

  const location = useLocation();
  const { brandId, socialingId } = location.state || {};
  const { data: landingBrandData } = useGetLandingBrand(brandId);

  const { data: survey } = useGetSurveys(brandId);
  const { mutate: registForm } = useRegistForm();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { showErrorModal } = useSystemModal();

  useEffect(() => {
    if (isSurveyArray(survey)) {
      header({
        visible: true,
        title: survey[0].title,
        onBack: () => window.history.back(),
      });
    }
  }, [header, survey]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  if (!isSurveyArray(survey)) {
    return (
      <BrandingLayout>
        <div>Survey not found.</div>
      </BrandingLayout>
    );
  }
  const { questions } = survey[0];
  const currentQuestionObj = questions[currentIndex];
  const currentAnswer = answers[currentQuestionObj.id];
  const isCurrentQuestionAnswered = isAnswered(currentAnswer);

  const handleNext = async () => {
    if (!isAnswered(answers[questions[currentIndex].id])) return;

    if (
      survey &&
      survey[0]?.questions &&
      currentIndex < survey[0].questions.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const response = await normalizeAnswers(answers);

    const payload = {
      channelId: socialingId,
      answers: response,
    };

    registForm(
      { survey_id: survey[0]._id, requestBody: payload },
      {
        onSuccess: () => {
          navigate(Pathnames.SubmissionComplete);
        },
        onError: (error) => {
          const errorDetails = error.response.data as {
            detail: string;
          };
          showErrorModal(errorDetails.detail);
        },
      }
    );
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const totalQuestions = survey[0].questions.length;
  const progressPercentage =
    totalQuestions > 1 ? (currentIndex / (totalQuestions - 1)) * 100 : 100;

  return (
    <BrandingLayout style={{ marginTop: "60px" }}>
      <HeaderContainer>
        <LogoImage src={landingBrandData?.thumbnailImage?.url} />
      </HeaderContainer>
      <SurveySection>
        <ProgressBar>
          <RoundPrevButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <FaArrowLeft />
          </RoundPrevButton>
          <ProgressContainer>
            <ProgressBarStyled progress={progressPercentage} />
          </ProgressContainer>
        </ProgressBar>
        <SurveyContainer>
          <QuizCount>Q{currentIndex + 1}번</QuizCount>
          <AnimatedQuestionWrapper>
            <RenderQuestion
              question={currentQuestionObj}
              answer={answers[currentQuestionObj.id]}
              onChange={handleAnswerChange}
            />
            <ModernButton
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered}
            >
              {currentIndex === totalQuestions - 1 ? "제출" : "다음"}
            </ModernButton>
          </AnimatedQuestionWrapper>
        </SurveyContainer>
      </SurveySection>
    </BrandingLayout>
  );
};

const HeaderContainer = styled.div`
  position: absolute;
  top: 88px;
  z-index: 120;

  width: 100%;
  height: auto;
  transform-origin: 50% 43%;
  transform: translate3D(0, 0, 0);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 16px;
`;

const LogoImage = styled.img`
  position: absolute;
  right: 0;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 35%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  border-radius: 16px;
`;

const SurveySection = styled.div`
  position: absolute;
  transform: translateZ(0);

  height: 100%;
  width: 100%;
  margin: auto;
  padding-top: 144px;

  inset: 0;
  z-index: 90;
`;

const SurveyContainer = styled.div`
  margin: auto;
  width: 100%;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 430px;
  margin: 20px 0px;
  padding: 0px 20px;
`;

const ProgressContainer = styled.div`
  flex: 1;
  background-color: #e0e0e0;
  border-radius: 4px;
  height: 10px;
  overflow: hidden;
`;

const ProgressBarStyled = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: #111;
  transition: width 0.5s ease;
`;

const RoundPrevButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #111;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const AnimatedQuestionWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s;
`;

const QuizCount = styled.div`
  font-size: 32px;

  text-align: center;
  margin-left: 2px;
  font-weight: bold;
`;

const ModernButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 150px;
  padding: 10px 20px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: #111;
  color: #fff;
  border: none;
  border-radius: 16px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export default RegistForm;
