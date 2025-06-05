import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import logo from "assets/images/logo.png";
import { Pathnames } from "constants/index";
import useLogin from "hooks/auth/useLogin";
import userState from "recoils/atoms/auth/userState";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: login } = useLogin();
  const [_, setUserData] = useRecoilState(userState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUpButtonClick = () => {
    navigate(Pathnames.SignUp);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      login(
        { username: email, password },
        {
          onSuccess: (data) => {
            const { user } = data;
            setUserData(user);
            navigate(Pathnames.Home);
          },
          onError: () => {
            setErrorMessage(
              `로그인에 실패했습니다.
              이메일과 비밀번호를 확인해주세요.`
            );
          },
        }
      );
    } catch (err) {
      console.log(err);
      setErrorMessage(
        `로그인에 실패했습니다.
        이메일과 비밀번호를 확인해주세요.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoImage src={logo} alt="모임장 로고" />
        <Title>모임장 관리자 사이트</Title>
        <Subtitle>로그인해주세요</Subtitle>
        <Form onSubmit={handleLogin}>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            placeholder="name@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
