import React, { useEffect } from "react";
import styled from "styled-components";

import useCreateSurvey from "api/survey/hook/useCreateSurvey";
import useGetSurvey from "api/survey/hook/useGetSurvey";
import useUpdateSurvey from "api/survey/hook/useUpdateSurvey";
import { useBrandFormContext } from "hooks/brand/context/useBrandFormContext";
import useSaveBar from "hooks/components/useSaveBar";
import useSystemModal from "hooks/common/components/useSystemModal";
import useSurveyBuilder from "hooks/brand/context/useSurveyBuilder";

import Preview from "./preview";
import Builder from "./builder";
import { USER_NAME } from "configs";

const SurveyFormSection: React.FC = () => {
  const { brandId } = useBrandFormContext();
  const { mutate: createSurvey } = useCreateSurvey();
  const { data: surveyData } = useGetSurvey(brandId);
  const { mutate: updateSurvey } = useUpdateSurvey();
  const { questions, setQuestions } = useSurveyBuilder();
  const { showSaveBar, closeSaveBar } = useSaveBar();
  const { showErrorModal, showAnyMessageModal } = useSystemModal();

  const owner = localStorage.getItem(USER_NAME);
  const isTester = owner === "tester";

  const handleSubmit = () => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    const payload = {
      brand_id: brandId,
      title: "",
      description: "",
      questions: questions,
    };

    if (surveyData && surveyData[0]?._id) {
      updateSurvey(
        { survey_id: surveyData[0]._id, requestBody: payload },
        {
          onSuccess: (data) => {
            showAnyMessageModal("설문폼 수정이 완료되었습니다.");
            if (data && data.questions?.length) {
              setQuestions(data.questions);
            }
          },
          onError: () => {
            showErrorModal("수정에 실패했습니다.");
          },
        }
      );

      return;
    }

    createSurvey(payload, {
      onSuccess: (data) => {
        showAnyMessageModal("설문폼 저장이 완료되었습니다.");
        if (data && data[0]?.questions?.length) {
          setQuestions(data[0]?.questions);
        }
      },
      onError: () => {
        showErrorModal("저장에 실패했습니다.");
      },
    });
  };

  useEffect(() => {
    showSaveBar({
      isVisible: true,
      onSave: handleSubmit,
      buttonText: surveyData && surveyData[0]?._id ? "수정" : "저장",
    });

    return () => {
      closeSaveBar();
    };
  }, [showSaveBar, closeSaveBar, surveyData]);

  useEffect(() => {
    if (surveyData && surveyData[0]?.questions?.length) {
      setQuestions(surveyData[0]?.questions);
    }
  }, [surveyData]);

  return (
    <MainContainer>
      <Preview />
      <Builder />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  height: 100%;
`;

export default SurveyFormSection;
