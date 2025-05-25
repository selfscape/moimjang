import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState } from "recoil";

import { EditProfileInput } from "api/admin/users/editProfile";
import { Pathnames } from "constants/admin/index";
import userState from "recoils/atoms/auth/userState";
import useEditProfile from "hooks/admin/users/useEditProfile";
import useSystemModal from "hooks/common/components/useSystemModal";

import Header from "components/consumer/common/Header";
import SystemModal from "components/consumer/common/SystemModal";

const EditProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: editProfile } = useEditProfile();
  const [userData, setUserData] = useRecoilState(userState);
  const [formData, setFormData] = useState<EditProfileInput>({
    hobby: "",
    email: "",
    happyMoment: "",
    password: "",
    strength: "",
    username: "",
    gender: "",
    birth_year: 0,
    mbti: "",
    keyword: "",
    bestMedia: "",
    tmi: "",
  });
  const { openModal, showErrorModal } = useSystemModal();

  const handleBackButtonClick = () => {
    navigate(Pathnames.Profile);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, gender: e.target.value as "male" | "female" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gender) {
      alert("성별을 선택해주세요.");
      return;
    }

    if (userData) {
      editProfile(
        {
          user_id: String(userData.id),
          profileData: formData,
        },
        {
          onSuccess: (data) => {
            openModal({
              isOpen: true,
              title: "프로필 수정이 완료되었습니다.",
              confirmText: "확인",
              onConfirm: () => {
                setUserData(data);
                navigate(Pathnames.Profile);
              },
            });
          },
          onError: (error) => {
            const errorDetail = error.response.data as { detail: string };
            showErrorModal(errorDetail.detail);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username,
        email: userData.email,
        password: "",
        gender: userData.gender as "male" | "female",
        birth_year: userData.birth_year,
        mbti: userData.mbti,
        keyword: userData.keywords,
        hobby: userData.hobby,
        bestMedia: userData.favorite_media,
        strength: userData.strength,
        happyMoment: userData.happyMoment,
        tmi: userData.tmi,
      });
    }
  }, [userData]);

  return (
    <>
      <SignUpPage>
        <Header title="프로필 수정하기" onBack={handleBackButtonClick} />
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <InputField>
              <label>닉네임</label>
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력해주세요."
                  required
                />
              </div>
            </InputField>
            <InputField>
              <label>비밀번호</label>
              <div>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력해주세요."
                  required
                />
              </div>
            </InputField>

            <InputField>
              <label>성별</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleGenderChange}
                  />
                  <span style={{ marginLeft: "5px", whiteSpace: "nowrap" }}>
                    남성
                  </span>
                </label>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleGenderChange}
                  />
                  <span style={{ marginLeft: "5px", whiteSpace: "nowrap" }}>
                    여성
                  </span>
                </label>
              </div>
            </InputField>

            <InputField>
              <label>출생년도를 선택해주세요.</label>
              <input
                type="number"
                name="birth_year"
                value={formData.birth_year}
                onChange={handleInputChange}
                min="1900"
                max="2025"
                placeholder="YYYY"
                required
              />
            </InputField>

            <InputField>
              <label>MBTI를 알려주세요.</label>
              <select
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
              </select>
            </InputField>

            {/* <InputField>
            <label>나를 표현하는 3개의 단어를 적어주세요.</label>
            <input
              type="text"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
              placeholder="예시: “호기심, 허당, 긍정왕” "
              required
            />
          </InputField>

          <InputField>
            <label>좋아하는 취미를 적어주세요</label>
            <input
              type="text"
              name="hobby"
              value={formData.hobby}
              onChange={handleInputChange}
              placeholder="예시: “클라이밍, 요리 기타 등등...” "
              required
            />
          </InputField>

          <InputField>
            <label>
              가장 감명 깊게 봤던 영화/드라마/책 중 한 가지를 알려주세요.
            </label>
            <input
              type="text"
              name="bestMedia"
              value={formData.bestMedia}
              onChange={handleInputChange}
              required
            />
          </InputField>

          <InputField>
            <label>스스로의 매력 및 장점을 말해주세요.</label>
            <input
              type="text"
              name="strength"
              value={formData.strength}
              onChange={handleInputChange}
              placeholder="예시: “요리를 맛있게 할 줄 안다.” "
              required
            />
          </InputField>

          <InputField>
            <label>최근 가장 기분 좋았던 일을 적어주세요!</label>
            <input
              type="text"
              name="happyMoment"
              value={formData.happyMoment}
              onChange={handleInputChange}
              placeholder="예시: “오랜만에 가족과 함께 저녁을 먹으며 즐거운 시간을 보냄.” "
              required
            />
          </InputField>

          <InputField>
            <label>나의 TMI를 *한 가지만 적어주세요</label>
            <textarea
              name="tmi"
              value={formData.tmi}
              onChange={handleInputChange}
              placeholder="휴대폰을 항상 오른쪽 주머니에 넣는다            왼쪽은 절대 안된다."
            />
          </InputField> */}

            <SubmitButton type="submit">프로필 수정하기</SubmitButton>
          </form>
        </FormContainer>
      </SignUpPage>
      <SystemModal />
    </>
  );
};

const SignUpPage = styled.div`
  background-color: #f3f4f6;
  padding-top: 60px;
  min-height: 100vh;
`;

const FormContainer = styled.div`
  max-width: 430px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.div`
  margin-bottom: 1.5rem;

  input::placeholder {
    white-space: pre; /* 연속된 공백을 그대로 표시 */
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 0.5rem;
    display: block;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #2d3748;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #4c51bf;
      outline: none;
      box-shadow: 0 0 0 2px rgba(75, 85, 180, 0.2);
    }
  }

  textarea {
    resize: vertical;
  }

  button {
    background-color: #4c51bf;
    color: white;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    cursor: pointer;

    &:hover {
      background-color: #434190;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4c51bf;
  color: white;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #434190;
  }
`;

export default EditProfileForm;
