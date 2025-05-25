import React, { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import useSignUp from "hooks/auth/useSignUp";
import userState from "recoils/atoms/auth/userState";
import { Pathnames } from "constants/admin/index";
import useSystemModal from "hooks/common/components/useSystemModal";
import SystemModal from "components/consumer/common/SystemModal";

interface SignUpFormState {
  username: string;
  email: string;
  password: string;
  gender: "male" | "female" | "";
  birth_year: number;
  mbti: string;
  keywords: string;
  hobby: string;
  favorite_media: string;
  strength: string;
  happyMoment: string;
  tmi: string;
}

const MultiStepSignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: signUp } = useSignUp();
  const [_, setUserData] = useRecoilState(userState);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SignUpFormState>({
    username: "",
    email: "",
    password: "",
    gender: "",
    birth_year: 0,
    mbti: "",
    keywords: "",
    hobby: "",
    favorite_media: "",
    strength: "",
    happyMoment: "",
    tmi: "",
  });
  // 필드별 에러 상태 (비어있으면 "필수입력값 입니다." 메시지를 보여줌)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { openModal } = useSystemModal();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "birth_year" ? Number(value) : value,
    });
    // 해당 필드의 에러가 있다면 지워줌
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, gender: e.target.value as "male" | "female" });
    if (errors.gender) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.gender;
        return newErrors;
      });
    }
  };

  // 현재 스텝에 필요한 필드들을 검사하는 함수
  const validateStep = () => {
    let newErrors: { [key: string]: string } = {};
    if (currentStep === 0) {
      if (!formData.email.trim()) {
        newErrors.email = "필수입력값 입니다.";
      }
      if (!formData.password.trim()) {
        newErrors.password = "필수입력값 입니다.";
      }
    } else if (currentStep === 1) {
      if (!formData.username.trim()) {
        newErrors.username = "필수입력값 입니다.";
      }
    } else if (currentStep === 2) {
      if (!formData.gender) {
        newErrors.gender = "필수입력값 입니다.";
      }
      if (!formData.birth_year || formData.birth_year === 0) {
        newErrors.birth_year = "필수입력값 입니다.";
      }
    } else if (currentStep === 3) {
      if (!formData.mbti.trim()) {
        newErrors.mbti = "필수입력값 입니다.";
      }
      if (!formData.keywords.trim()) {
        newErrors.keywords = "필수입력값 입니다.";
      }
      if (!formData.hobby.trim()) {
        newErrors.hobby = "필수입력값 입니다.";
      }
      if (!formData.favorite_media.trim()) {
        newErrors.favorite_media = "필수입력값 입니다.";
      }
      if (!formData.strength.trim()) {
        newErrors.strength = "필수입력값 입니다.";
      }
      if (!formData.happyMoment.trim()) {
        newErrors.happyMoment = "필수입력값 입니다.";
      }
      if (!formData.tmi.trim()) {
        newErrors.tmi = "필수입력값 입니다.";
      }
    }
    return newErrors;
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // 에러가 없다면 에러 상태 초기화 후 스텝 이동 또는 최종 제출
    setErrors({});
    if (currentStep < 2) {
      nextStep();
    } else {
      signUp(formData, {
        onSuccess: (data) => {
          setUserData(data);
          openModal({
            isOpen: true,
            title: "회원가입이 성공적으로 완료되었습니다! 🎉",
            message: `이제 로그인하시면 서비스를 이용하실 수 있어요. \n
          로그인 화면으로 이동할게요! 😊`,
            confirmText: "확인",
            onConfirm: () => {
              navigate(Pathnames.Login);
            },
          });
        },
        onError: (error) => {
          const errorMessage = error.response.data as { detail: string };

          if (
            errorMessage.detail ===
            "해당 이메일로 가입된 사용자가 이미 존재합니다."
          ) {
            // 이메일 필드에 에러 메시지를 노출시키고, 첫번째 스텝(이메일/비밀번호)으로 이동
            setErrors((prev) => ({ ...prev, email: errorMessage.detail }));
            setCurrentStep(0);
          }

          if (errorMessage.detail === "Username already exists.") {
            // 이메일 필드에 에러 메시지를 노출시키고, 첫번째 스텝(이메일/비밀번호)으로 이동
            setErrors((prev) => ({
              ...prev,
              username: "해당 사용자 명으로 가입된 사용자가 존재합니다.",
            }));
            setCurrentStep(1);
          }
        },
      });
    }
  };

  return (
    <>
      <Container>
        <CardContainer>
          <FormTitle>계정 만들기</FormTitle>
          <Form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <StepContainer>
                <Field>
                  <Label>이메일</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    required
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </Field>
                <Field>
                  <Label>비밀번호</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                  {errors.password && (
                    <ErrorMessage>{errors.password}</ErrorMessage>
                  )}
                </Field>
              </StepContainer>
            )}
            {currentStep === 1 && (
              <StepContainer>
                <Field>
                  <Label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "1rem",
                      marginBottom: "8px",
                    }}
                  >
                    사용자 이름
                  </Label>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      lineHeight: "1.6",
                      color: "#888",
                      marginBottom: "16px",
                    }}
                  >
                    문토를 통해 가입하시는 분들은
                    <br />
                    문토 닉네임과 동일하게 작성해주세요.
                    <br />
                    그렇지 않다면 소셜링에서 사용할 닉네임을 적어주세요!
                  </span>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="예: 소셜링 닉네임을 입력해주세요."
                    required
                  />
                  {errors.username && (
                    <ErrorMessage>{errors.username}</ErrorMessage>
                  )}
                </Field>
              </StepContainer>
            )}
            {currentStep === 2 && (
              <StepContainer>
                <Field>
                  <Label>성별</Label>
                  <RadioGroup>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleGenderChange}
                        required
                      />
                      남성
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleGenderChange}
                      />
                      여성
                    </label>
                  </RadioGroup>
                  {errors.gender && (
                    <ErrorMessage>{errors.gender}</ErrorMessage>
                  )}
                </Field>
                <Field>
                  <Label>출생년도</Label>
                  <Input
                    type="number"
                    name="birth_year"
                    value={formData.birth_year || ""}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    min="1900"
                    max="2025"
                    required
                  />
                  {errors.birth_year && (
                    <ErrorMessage>{errors.birth_year}</ErrorMessage>
                  )}
                </Field>

                <Field>
                  <Label>MBTI</Label>
                  <Select
                    name="mbti"
                    value={formData.mbti}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select MBTI</option>
                    <option value="INTJ">INTJ</option>
                    <option value="INTP">INTP</option>
                    <option value="ENTJ">ENTJ</option>
                    <option value="ENTP">ENTP</option>
                    <option value="INFJ">INFJ</option>
                    <option value="INFP">INFP</option>
                    <option value="ENFJ">ENFJ</option>
                    <option value="ENFP">ENFP</option>
                    <option value="ISTJ">ISTJ</option>
                    <option value="ISFJ">ISFJ</option>
                    <option value="ESTJ">ESTJ</option>
                    <option value="ESFJ">ESFJ</option>
                    <option value="ISTP">ISTP</option>
                    <option value="ISFP">ISFP</option>
                    <option value="ESTP">ESTP</option>
                    <option value="ESFP">ESFP</option>
                  </Select>
                  {errors.mbti && <ErrorMessage>{errors.mbti}</ErrorMessage>}
                </Field>
              </StepContainer>
            )}

            <ButtonContainer>
              {currentStep > 0 && (
                <SecondaryButton type="button" onClick={prevStep}>
                  이전
                </SecondaryButton>
              )}
              <PrimaryButton type="submit">
                {currentStep < 2 ? "다음" : "계정 만들기"}
              </PrimaryButton>
            </ButtonContainer>
          </Form>
        </CardContainer>
      </Container>
      <SystemModal />
    </>
  );
};

export default MultiStepSignUpForm;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: #f8f8f8;
`;

const CardContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  @media (max-width: 500px) {
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const StepContainer = styled.div`
  margin-bottom: 1rem;
`;

const Field = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border 0.3s;
  &:focus {
    border-color: #6b46c1;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border 0.3s;
  &:focus {
    border-color: #6b46c1;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border 0.3s;
  resize: vertical;
  &:focus {
    border-color: #6b46c1;
    outline: none;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  label {
    font-size: 1rem;
    color: #555;
    display: flex;
    align-items: center;
    input {
      margin-right: 0.5rem;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #6b46c1, #805ad5);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.02);
  }
`;

const SecondaryButton = styled.button`
  background: #eee;
  border: none;
  border-radius: 8px;
  color: #333;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.02);
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;
