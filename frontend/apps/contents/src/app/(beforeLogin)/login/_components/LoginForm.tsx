"use client";

import React, { useEffect, useState } from "react";
import useErrorStore from "../_store/useErrorMessageStore";
import styles from "./LoginForm.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import pathnames from "@/app/_constant/pathnames";
import useLogin from "../_api/useLogin";
import useCookie from "@util/hooks/useCookie";
import { OWNER } from "@constants/auth";
import { USER_DATA } from "@/app/_constant/auth";

export default function LoginForm() {
  const redirectUrl = useSearchParams().get("redirectUrl");
  const router = useRouter();
  const owner = useCookie(OWNER);
  const { mutate: login } = useLogin(owner);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { clearErrorMessage, errorMessage, setErrorMessage } = useErrorStore();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) clearErrorMessage();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) clearErrorMessage();
  };

  const handleSignUp = () => {
    router.push(pathnames.signup);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(
      { username: email, password },
      {
        onSuccess: (data) => {
          if (data.user) {
            localStorage.setItem(USER_DATA, JSON.stringify(data.user));
          }

          if (redirectUrl) {
            const originalUrl = decodeURIComponent(redirectUrl);
            window.location.href = originalUrl;
            return;
          }
          router.push(pathnames.home);
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      }
    );
  };

  useEffect(() => {
    return clearErrorMessage();
  }, [clearErrorMessage]);

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      <label className={styles.label} htmlFor="email">
        이메일
      </label>
      <input
        className={styles.input}
        type="email"
        id="email"
        required
        value={email}
        onChange={handleEmailChange}
      />

      <div className={styles.passwordWrapper}>
        <label
          className={styles.label}
          htmlFor="password"
          style={{ marginBottom: "0.5rem" }}
        >
          비밀번호
        </label>
        <input
          className={styles.input}
          type={showPassword ? "text" : "password"}
          id="password"
          required
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "숨기기" : "보기"}
        </button>
      </div>

      <button className={styles.submitButton} type="submit">
        로그인
      </button>
      <button
        className={styles.signUpButton}
        type="button"
        onClick={handleSignUp}
      >
        회원가입
      </button>
    </form>
  );
}
