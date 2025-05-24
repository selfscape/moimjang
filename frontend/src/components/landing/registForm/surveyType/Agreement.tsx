import React from "react";
import styled from "styled-components";
import { SurveyType } from "interfaces/landing";
import { AgreementQuestion } from "interfaces/landing";

interface AgreementProps {
  question: AgreementQuestion;
  answer: boolean;
  onChange: (questionId: string, value: any) => void;
}

const Agreement: React.FC<AgreementProps> = ({
  question,
  answer,
  onChange,
}) => {
  const handleAgree = () => {
    onChange(question.id, true);
  };

  return (
    <Container>
      <Title>{question.text}</Title>
      {question.description && (
        <Description>{question.description}</Description>
      )}

      <Item>
        <Label>수집하는 개인정보 항목</Label>
        <Value>{question.personalInfoItems}</Value>
      </Item>
      <Item>
        <Label>수집 및 이용 목적</Label>
        <Value>{question.purposeOfUse}</Value>
      </Item>
      <Item>
        <Label>보유 및 이용 기간</Label>
        <Value>{question.retentionPeriod}</Value>
      </Item>

      <Footer>
        <AgreeButton active={answer} onClick={handleAgree}>
          개인정보 수집 및 이용에 동의합니다.
        </AgreeButton>
      </Footer>
    </Container>
  );
};

export default Agreement;

// 스타일 예시
const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  white-space: pre-line;
`;

const Item = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 6px;
  font-size: 14px;
`;

const Value = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.4;
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
  background-color: ${({ active, theme }) =>
    active ? "#28a745" : "transparent"};
  color: ${({ active }) => (active ? "#fff" : "#28a745")};
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease, border 0.3s ease;
  &:hover {
    background-color: ${({ active }) => (active ? "#28a745" : "#e6f9ea")};
  }
`;
