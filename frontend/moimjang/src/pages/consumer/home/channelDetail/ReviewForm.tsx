import React, { useEffect, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

import {
  styleOptions,
  firstImpressionOptions,
  memorablePartOptions,
  keywordOptions,
} from "constants/consumer/channel/reviewOption";
import { Pathnames } from "constants/admin";
import userState from "recoils/atoms/auth/userState";
import useCreateReview from "hooks/consumer/useCreateReview";
import useHeader from "hooks/consumer/components/useHeader";
import useGetGroups from "hooks/consumer/useGetGroups";
import useSystemModal from "hooks/common/components/useSystemModal";
import ConsumerLayout from "components/consumer/common/ConsumerLayout";

interface ReviewState {
  selectedParticipant: string;
  style: string[];
  impression: string[];
  conversation: string[];
  keywords: string[];
  instagram: string;
  kakao: string;
  phoneNumber: string;
  isAnonymous: boolean; // 추가된 필드
}

type Action =
  | {
      type: "SET_FIELD";
      field: keyof ReviewState;
      value: string | string[] | boolean;
    }
  | { type: "TOGGLE_FIELD"; field: keyof ReviewState; value: string }
  | { type: "RESET" };

const initialState: ReviewState = {
  selectedParticipant: "",
  style: [],
  impression: [],
  conversation: [],
  keywords: [],
  instagram: "",
  kakao: "",
  phoneNumber: "",
  isAnonymous: false, // 기본값: 익명 아님
};

function reducer(state: ReviewState, action: Action): ReviewState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_FIELD":
      const currentArray = state[action.field] as string[];
      return currentArray.includes(action.value)
        ? {
            ...state,
            [action.field]: currentArray.filter(
              (item) => item !== action.value
            ),
          }
        : { ...state, [action.field]: [...currentArray, action.value] };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const ReviewForm: React.FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [userData] = useRecoilState(userState);
  const { mutate: createReview } = useCreateReview();
  const { header } = useHeader();
  const { data, refetch } = useGetGroups();
  const { openModal } = useSystemModal();

  const handleBackButtonClick = () => {
    navigate(`${Pathnames.ChannelDetail}/${channelId}`);
  };

  const groupMembers = data?.[0]?.joined_users || [];
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState<{ [key in keyof ReviewState]?: string }>(
    {}
  );

  // 각 필수 섹션에 대한 ref 생성
  const participantRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const impressionRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef<HTMLDivElement>(null);
  const isAnonymousRef = useRef<HTMLDivElement>(null);

  // 필수 에러 제거 함수
  const removeError = (field: keyof ReviewState) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxToggle = (field: keyof ReviewState, value: string) => {
    removeError(field);
    dispatch({ type: "TOGGLE_FIELD", field, value });
  };

  const handleInputChange =
    (field: keyof ReviewState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      removeError(field);
      dispatch({ type: "SET_FIELD", field, value: e.target.value });
    };

  // 라디오 버튼 선택 변경 핸들러
  const handleRadioChange = (value: boolean) => {
    removeError("isAnonymous");
    dispatch({ type: "SET_FIELD", field: "isAnonymous", value });
  };

  const renderCheckboxOptions = (
    options: string[],
    field: keyof ReviewState,
    label: string,
    refProp?: React.Ref<HTMLDivElement>
  ) => (
    <QuestionSection ref={refProp}>
      <Label>
        {label} <RequiredMark>*</RequiredMark>
      </Label>
      {errors[field] && (
        <ErrorMessage style={{ marginBottom: "16px" }}>
          {errors[field]}
        </ErrorMessage>
      )}
      {options.map((option) => (
        <CheckboxLabel key={option}>
          <input
            type="checkbox"
            value={option}
            checked={(state[field] as string[]).includes(option)}
            onChange={() => handleCheckboxToggle(field, option)}
          />
          {option}
        </CheckboxLabel>
      ))}
    </QuestionSection>
  );

  const renderTextInputSection = (label: string, field: keyof ReviewState) => (
    <QuestionSection style={{ marginBottom: "16px", padding: "0px" }}>
      <Label>{label}</Label>
      <Input
        type="text"
        value={state[field] as string}
        onChange={handleInputChange(field)}
      />
    </QuestionSection>
  );

  const handleSubmit = () => {
    // 필수 항목에 대한 validation
    const newErrors: { [key in keyof ReviewState]?: string } = {};
    if (!state.selectedParticipant)
      newErrors.selectedParticipant = "필수 입력값 입니다.";
    if (state.style.length === 0) newErrors.style = "필수 입력값 입니다.";
    if (state.impression.length === 0)
      newErrors.impression = "필수 입력값 입니다.";
    if (state.conversation.length === 0)
      newErrors.conversation = "필수 입력값 입니다.";
    if (state.keywords.length === 0) newErrors.keywords = "필수 입력값 입니다.";
    // 익명 여부는 항상 선택되어있으므로 별도 체크가 필요없지만, 혹시 모를 경우:
    if (state.isAnonymous === undefined)
      newErrors.isAnonymous = "필수 선택값 입니다.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.selectedParticipant && participantRef.current) {
        participantRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (newErrors.style && styleRef.current) {
        styleRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (newErrors.impression && impressionRef.current) {
        impressionRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (newErrors.conversation && conversationRef.current) {
        conversationRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (newErrors.keywords && keywordRef.current) {
        keywordRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (newErrors.isAnonymous && isAnonymousRef.current) {
        isAnonymousRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // 추가정보는 선택 입력이므로 빈값 허용
    const additional_info = `${
      state.instagram ? `Instagram: ${state.instagram}, ` : ""
    }${state.kakao ? `Kakao: ${state.kakao}, ` : ""}${
      state.phoneNumber ? `Phone: ${state.phoneNumber}` : ""
    }`;

    const reviewData = {
      target_user_id: Number(state.selectedParticipant),
      reviewer_user_id: userData.id,
      channel_id: Number(channelId),
      style: state.style.join(", "),
      impression: state.impression.join(", "),
      conversation: state.conversation.join(", "),
      keywords: state.keywords.join(", "),
      additional_info,
      is_reviewer_anonymous: state.isAnonymous, // 익명 여부 추가
    };

    createReview(reviewData, {
      onSuccess: () => {
        openModal({
          isOpen: true,
          title: "피드백 제출 완료",
          message: "계속 작성하시겠습니까?",
          showCancel: true,
          onConfirm: () => {
            dispatch({ type: "RESET" });
            setErrors({});
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          onCancel: () => navigate(`${Pathnames.ChannelDetail}/${channelId}`),
        });
      },
    });
  };

  useEffect(() => {
    header({
      visible: true,
      title: "대화 후기 남기기",
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

  return (
    <ConsumerLayout>
      <SectionContainer>
        {/* 참여자 선택 */}
        <QuestionSection ref={participantRef} style={{ marginBottom: "0px" }}>
          <Label>
            참여자 선택 <RequiredMark>*</RequiredMark>
          </Label>
          {errors.selectedParticipant && (
            <ErrorMessage style={{ marginBottom: "16px" }}>
              {errors.selectedParticipant}
            </ErrorMessage>
          )}
          <Select
            value={state.selectedParticipant}
            onChange={(e) => {
              removeError("selectedParticipant");
              dispatch({
                type: "SET_FIELD",
                field: "selectedParticipant",
                value: e.target.value,
              });
            }}
          >
            <option value="">선택해주세요</option>
            {groupMembers.map(({ id, user_name, gender }) => (
              <option key={id} value={id}>
                {gender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
                {user_name}
              </option>
            ))}
          </Select>
        </QuestionSection>

        {/* 스타일 선택 */}
        {renderCheckboxOptions(
          styleOptions,
          "style",
          "그분의 옷차림과 스타일은 \n 어떤 느낌이었나요?",
          styleRef
        )}

        {/* 첫인상 선택 */}
        {renderCheckboxOptions(
          firstImpressionOptions,
          "impression",
          "그분에게 어떤 첫인상을 받으셨나요?",
          impressionRef
        )}

        {/* 대화 내용 선택 */}
        {renderCheckboxOptions(
          memorablePartOptions,
          "conversation",
          "대화 중에서 특히 기억에 남거나 와닿는 \n 부분이 있었나요?",
          conversationRef
        )}

        {/* 키워드 선택 */}
        <QuestionSection ref={keywordRef}>
          <Label>
            그분과 어울리는 키워드를 골라주세요 <RequiredMark>*</RequiredMark>
          </Label>
          {errors.keywords && (
            <ErrorMessage style={{ marginBottom: "16px" }}>
              {errors.keywords}
            </ErrorMessage>
          )}
          <KeywordContainer>
            {keywordOptions.map((keyword) => (
              <KeywordButton
                key={keyword}
                selected={(state.keywords as string[]).includes(keyword)}
                onClick={() => handleCheckboxToggle("keywords", keyword)}
              >
                {keyword}
              </KeywordButton>
            ))}
          </KeywordContainer>
        </QuestionSection>

        <QuestionSection ref={isAnonymousRef}>
          <Label>설문 결과를 익명으로 하시겠어요?</Label>
          {errors.isAnonymous && (
            <ErrorMessage style={{ marginBottom: "16px" }}>
              {errors.isAnonymous}
            </ErrorMessage>
          )}
          <RadioContainer>
            <RadioLabel>
              <input
                type="radio"
                name="isAnonymous"
                value="true"
                checked={state.isAnonymous === true}
                onChange={() => handleRadioChange(true)}
              />
              예
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="isAnonymous"
                value="false"
                checked={state.isAnonymous === false}
                onChange={() => handleRadioChange(false)}
              />
              아니요
            </RadioLabel>
          </RadioContainer>
        </QuestionSection>

        {/* 추가 연락처 (선택 항목) */}
        <QuestionSection>
          <Label>앞으로 친하게 지내요!</Label>
          <Description>
            앞으로도 친하게 지내고 싶다면 인스타그램, 카카오톡 또는 전화번호를
            남겨주세요. 서로 연락하며 더 좋은 인연을 이어갈 수 있을 거예요! 😊
            <br />
            (입력은 선택사항입니다.)
          </Description>
          {renderTextInputSection("인스타그램 아이디", "instagram")}
          {renderTextInputSection("카카오톡 아이디", "kakao")}
          {renderTextInputSection("핸드폰 번호", "phoneNumber")}
        </QuestionSection>

        <ButtonWrapper>
          <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
        </ButtonWrapper>
      </SectionContainer>
    </ConsumerLayout>
  );
};

const SectionContainer = styled.div`
  max-width: 430px;
  margin: 0 auto 40px;
  background-color: #ffffff;
  border-radius: 12px;
  white-space: pre-line;
`;

const QuestionSection = styled.div`
  margin-bottom: 32px;
  padding: 16px 0px;
  background-color: #fff;
  border-radius: 8px;
`;

const Label = styled.h3`
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 12px;
  color: #2d3748;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 12px;
  color: #2d3748;
  line-height: 1.4;
`;

const RequiredMark = styled.span`
  color: red;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  background-color: #f7fafc;
  font-size: 1rem;
  color: #2d3748;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3182ce;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f7fafc;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1.5;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: #edf2f7;
    border-color: #cbd5e0;
  }

  input {
    min-width: 18px;
    min-height: 18px;
  }
`;

const KeywordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const KeywordButton = styled.button<{ selected: boolean }>`
  padding: 10px 18px;
  border: 1px solid #cbd5e0;
  border-radius: 20px;
  background-color: ${(props) => (props.selected ? "#3182ce" : "#f7fafc")};
  color: ${(props) => (props.selected ? "#ffffff" : "#2d3748")};
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#2b6cb0" : "#edf2f7")};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  background-color: #f7fafc;
  font-size: 1rem;
  color: #2d3748;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3182ce;
  }
`;

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  cursor: pointer;

  padding: 1rem;

  border: 1px solid #cbd5e0;
  border-radius: 20px;
  background-color: "#f7fafc";

  input {
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  padding: 0px 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #3182ce;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2b6cb0;
  }
`;

export default ReviewForm;
