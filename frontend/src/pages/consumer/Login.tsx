import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { Pathnames } from "constants/admin/index";
import { ACCEESS_TOKEN, USER_ROLE } from "configs";
import useLogin from "hooks/auth/useLogin";

import logo from "assets/images/logo.png";

const Login = () => {
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirectUrl");

  const navigate = useNavigate();
  const { mutate: login } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUpButtonClick = () => {
    navigate(Pathnames.SignUp);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    login(
      { username: email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem(ACCEESS_TOKEN, data.access_token);
          localStorage.setItem(USER_ROLE, data.user.role);

          if (redirectUrl) {
            const originalUrl = decodeURIComponent(redirectUrl);
            window.location.href = originalUrl;

            return;
          }
          navigate(Pathnames.Home);
        },
        onError: (error) => {
          const errorData = error.response.data as { detail: string };

          setErrorMessage(errorData.detail);
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  return (
    <Container>
      <LoginBox>
        <LogoImage src={logo} alt="모임장 로고" />
        <Title>모임장</Title>
        <Subtitle>로그인해주세요</Subtitle>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Form onSubmit={handleLogin}>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            required
            value={email}
            onChange={handleEmailChange}
          />

          <Label htmlFor="password">비밀번호</Label>
          <PasswordWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <ToggleButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "숨기기" : "보기"}
            </ToggleButton>
          </PasswordWrapper>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </SubmitButton>
          <SignUpButton type="button" onClick={handleSignUpButtonClick}>
            회원가입
          </SignUpButton>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default Login;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const LoginBox = styled.div`
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  outline: none;
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    border: 1px solid #442d1c;
    box-shadow: 0 0 3px #442d1c;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 16px;
  right: 10px;
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  background: #442d1c;
  color: white;
  cursor: pointer;
  border: none;
  margin-top: 1rem;
  transition: background 0.2s;

  &:disabled {
    background: #a5b4fc;
    cursor: not-allowed;
  }
`;

const SignUpButton = styled(SubmitButton)`
  background: transparent;
  color: #442d1c;
  border: 2px solid #442d1c;
  margin-top: 0.5rem;

  &:hover {
    background: #442d1c;
    color: white;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.9rem;
  color: red;
  text-align: center;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const LogoImage = styled.img`
  width: 250px;
  height: auto;
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-out, ${bounce} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
`;
