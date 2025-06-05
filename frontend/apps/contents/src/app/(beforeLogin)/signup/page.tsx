"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import useSignup, { RequestBody } from "./_api/useSignup";
import pathnames from "@/app/_constant/pathnames";
import { useSystemModalStore } from "@ui/store/useSystemModalStore";

const MultiStepSignUpForm: React.FC = () => {
  const router = useRouter();
  const { mutate: signUp } = useSignup();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<RequestBody>({
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { open } = useSystemModalStore();

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
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, gender: e.target.value as "male" | "female" });
    if (errors.gender) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.gender;
        return copy;
      });
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (currentStep === 0) {
      if (!formData.email.trim()) newErrors.email = "필수입력값 입니다.";
      if (!formData.password.trim()) newErrors.password = "필수입력값 입니다.";
    } else if (currentStep === 1) {
      if (!formData.username.trim()) newErrors.username = "필수입력값 입니다.";
    } else if (currentStep === 2) {
      if (!formData.gender) newErrors.gender = "필수입력값 입니다.";
      if (!formData.birth_year) newErrors.birth_year = "필수입력값 입니다.";
      if (!formData.mbti.trim()) newErrors.mbti = "필수입력값 입니다.";
    }
    return newErrors;
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    if (currentStep < 2) {
      nextStep();
    } else {
      signUp(formData, {
        onSuccess: (data) => {
          open({
            isOpen: true,
            title: "회원가입이 성공적으로 완료되었습니다! 🎉",
            message:
              "이제 로그인하시면 서비스를 이용하실 수 있어요.\n로그인 화면으로 이동할게요! 😊",
            confirmText: "확인",
            onConfirm: () => {
              router.push(pathnames.login);
            },
          });
        },
        onError: (error) => {
          if (
            error.message === "해당 이메일로 가입된 사용자가 이미 존재합니다."
          ) {
            setErrors((prev) => ({ ...prev, email: error.message }));
            setCurrentStep(0);
          }
          if (error.message === "Username already exists.") {
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
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <h2 className={styles.formTitle}>계정 만들기</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <div className={styles.stepContainer}>
              <div className={styles.field}>
                <label className={styles.label}>이메일</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  required
                  className={styles.input}
                />
                {errors.email && (
                  <span className={styles.errorMessage}>{errors.email}</span>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className={styles.input}
                />
                {errors.password && (
                  <span className={styles.errorMessage}>{errors.password}</span>
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.stepContainer}>
              <div className={styles.field}>
                <label className={styles.usernameLabel}>사용자 이름</label>
                <span className={styles.usernameNote}>
                  문토를 통해 가입하시는 분들은
                  <br />
                  문토 닉네임과 동일하게 작성해주세요.
                  <br />
                  그렇지 않다면 소셜링에서 사용할 닉네임을 적어주세요!
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="예: 소셜링 닉네임을 입력해주세요."
                  required
                  className={styles.input}
                />
                {errors.username && (
                  <span className={styles.errorMessage}>{errors.username}</span>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.stepContainer}>
              <div className={styles.field}>
                <label className={styles.label}>성별</label>
                <div className={styles.radioGroup}>
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
                </div>
                {errors.gender && (
                  <span className={styles.errorMessage}>{errors.gender}</span>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>출생년도</label>
                <input
                  type="number"
                  name="birth_year"
                  value={formData.birth_year || ""}
                  onChange={handleInputChange}
                  placeholder="YYYY"
                  min={1900}
                  max={2025}
                  required
                  className={styles.input}
                />
                {errors.birth_year && (
                  <span className={styles.errorMessage}>
                    {errors.birth_year}
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>MBTI</label>
                <select
                  name="mbti"
                  value={formData.mbti}
                  onChange={handleInputChange}
                  required
                  className={styles.select}
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
                </select>
                {errors.mbti && (
                  <span className={styles.errorMessage}>{errors.mbti}</span>
                )}
              </div>
            </div>
          )}

          <div className={styles.buttonContainer}>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.secondaryButton}
              >
                이전
              </button>
            )}
            <button type="submit" className={styles.primaryButton}>
              {currentStep < 2 ? "다음" : "계정 만들기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepSignUpForm;
