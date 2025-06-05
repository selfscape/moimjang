"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { useSystemModalStore } from "@ui/store/useSystemModalStore";
import useEditProfile, { RequestBody } from "../_api/useEditProfile";
import pathnames from "@/app/_constant/pathnames";
import { USER_DATA } from "@/app/_constant/auth";

export default function Form() {
  const { open, showErrorModal } = useSystemModalStore();
  const [user, setUser] = useState<RequestBody>({
    id: 0,
    username: "",
    gender: "male",
    birth_year: 0,
    created_at: "",
    email: "",
    favorite_media: null,
    happyMoment: "",
    hobby: "",
    keywords: null,
    mbti: "",
    role: "user",
    strength: "",
    tmi: "",
    password: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem(USER_DATA);
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser({
        id: parsed.id || 0,
        username: parsed.username || "",
        gender: parsed.gender || "male",
        birth_year: parsed.birth_year || 0,
        created_at: parsed.created_at || "",
        email: parsed.email || "",
        favorite_media: parsed.favorite_media || null,
        happyMoment: parsed.happyMoment || "",
        hobby: parsed.hobby || "",
        keywords: parsed.keywords || null,
        mbti: parsed.mbti || "",
        role: parsed.role || "user",
        strength: parsed.strength || "",
        tmi: parsed.tmi || "",
        password: "",
      });
    }
  }, []);
  const { mutate: editProfile } = useEditProfile();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      editProfile(
        {
          requestBody: user,
        },
        {
          onSuccess: (data) => {
            open({
              isOpen: true,
              title: "프로필 수정이 완료되었습니다.",
              confirmText: "확인",
              onConfirm: () => {
                localStorage.setItem("USER_DATA", JSON.stringify(data));
                router.push(pathnames.profile);
              },
            });
          },
          onError: (error) => {
            showErrorModal(error.message);
          },
        }
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label>닉네임</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              placeholder="아이디를 입력해주세요."
              required
            />
          </div>

          <div className={styles.inputField}>
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력해주세요."
              required
            />
          </div>

          <div className={styles.inputField}>
            <label>성별</label>
            <div className={styles.genderOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={user.gender === "male"}
                  onChange={handleGenderChange}
                />
                <span>남성</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={user.gender === "female"}
                  onChange={handleGenderChange}
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          <div className={styles.inputField}>
            <label>출생년도를 선택해주세요.</label>
            <input
              type="number"
              name="birth_year"
              value={user.birth_year}
              onChange={handleInputChange}
              min="1900"
              max="2025"
              placeholder="YYYY"
              required
            />
          </div>

          <div className={styles.inputField}>
            <label>MBTI를 알려주세요.</label>
            <select
              name="mbti"
              value={user.mbti}
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
          </div>

          <button type="submit" className={styles.submitButton}>
            프로필 수정하기
          </button>
        </form>
      </div>
    </div>
  );
}
