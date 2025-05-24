import styled from "styled-components";

export const Container = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

export const QuestionLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const RequiredStar = styled.span`
  color: #e55353;
  margin-left: 4px;
`;

export const LabelText = styled.span`
  font-weight: 500;
  font-size: 18px;
  color: #333;
  letter-spacing: 0.5px;
`;

export const Description = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    background: #ffffff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.25);
  }
`;
