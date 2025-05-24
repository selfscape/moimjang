import { Question } from "interfaces/brand/survey";
import { SurveyType } from "interfaces/brand/survey";
import { useRecoilState } from "recoil";
import { surveyQuestionsAtom } from "recoils/atoms/admin/surveyState";
import { v4 as uuid } from "uuid";

const useSurveyBuilder = () => {
  const [questions, setQuestions] = useRecoilState(surveyQuestionsAtom);

  const addQuestion = (type: SurveyType) => {
    setQuestions((prev) => {
      // Prepare base fields (without order)
      const base: any = {
        id: uuid(),
        type,
        text: "",
        description: "",
        isRequired: false,
      };
      // Build question-specific fields
      let newQ: any;
      switch (type) {
        case SurveyType.PLAINTEXT:
          newQ = { ...base, numericOnly: false };
          break;
        case SurveyType.SELECT:
        case SurveyType.DROPDOWN:
          newQ = { ...base, options: [""], multiSelect: false };
          break;
        case SurveyType.AGREEMENT:
          newQ = {
            ...base,
            personalInfoItems: "",
            purposeOfUse: "",
            retentionPeriod: "",
          };
          break;
        default:
          newQ = base;
      }
      // Assign order based on current array length
      const questionWithOrder: Question = {
        ...newQ,
        order: prev.length,
      };
      return [...prev, questionWithOrder];
    });
  };

  const updateField = (id: string, changes: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...changes } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addOption = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id && "options" in q
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const updateOption = (id: string, index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id && "options" in q
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };
  const removeOption = (id: string, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id && "options" in q
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  return {
    questions,
    addQuestion,
    setQuestions,
    updateField,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
  };
};

export default useSurveyBuilder;
