import { useState } from "react";
import {
  Container,
  QuestionLabel,
  RequiredStar,
  LabelText,
  Description,
} from "./Styles";
import { AgreementQuestion, Question } from "interfaces/brand/survey";
import styled from "styled-components";

interface Props {
  question: Question;
}

const Agreement = ({ question }: Props) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Container>
      <QuestionLabel>
        <LabelText>{question.text || "질문을 입력해주세요."}</LabelText>
        {question?.isRequired && <RequiredStar>*</RequiredStar>}
      </QuestionLabel>

      <Description>
        {question?.description || "설명 또는 부가 정보를 입력하세요"}
      </Description>

      <InfoContainer>
        <Item>
          <Label>수집하는 개인정보 항목</Label>
          <Value>{(question as AgreementQuestion).personalInfoItems}</Value>
        </Item>
        <Item>
          <Label>수집 및 이용 목적</Label>
          <Value>{(question as AgreementQuestion).purposeOfUse}</Value>
        </Item>
        <Item>
          <Label>보유 및 이용 기간</Label>
          <Value>{(question as AgreementQuestion).retentionPeriod}</Value>
        </Item>

        <Footer>
          <AgreeButton
            active={agreed}
            onClick={() => setAgreed((prev) => !prev)}
          >
            개인정보 수집 및 이용에 동의합니다.
          </AgreeButton>
        </Footer>
      </InfoContainer>
    </Container>
  );
};

export default Agreement;

const InfoContainer = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 12px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const Value = styled.div`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
`;

interface AgreeButtonProps {
  active: boolean;
}

const AgreeButton = styled.button<AgreeButtonProps>`
  padding: 10px 16px;
  border: ${({ active }) => (active ? "none" : "2px solid #28a745")};
  border-radius: 6px;
  background-color: ${({ active }) => (active ? "#28a745" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#28a745")};
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease, border 0.3s ease;
  &:hover {
    background-color: ${({ active }) => (active ? "#28a745" : "#e6f9ea")};
  }
`;
