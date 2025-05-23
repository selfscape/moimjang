import styled from "styled-components";

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;

  &:focus-within {
    border-bottom-color: #888;
  }
`;

export const QuestionNumber = styled.span`
  font-weight: 600;
  color: #333;
`;

export const TextInput = styled.input`
  flex: 1;
  border: none;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: border-color 0.2s;
`;

// 설명 인풋
export const DescriptionInput = styled.input`
  width: 100%;

  padding: 0.5rem 0;

  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
`;

// 스위치 토글
export const Switch = styled.input.attrs({ type: "checkbox" })`
  width: 38px;
  height: 20px;
  -webkit-appearance: none;
  background: #ccc;
  border-radius: 9px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;

  &:checked {
    background: ${({ theme: { palette } }) => palette.grey700};
  }

  &:disabled {
    background: ${({ theme: { palette } }) => palette.grey700};
  }

  &::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 1px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  &:checked::before {
    transform: translateX(18px);
  }
`;

export const ToggleContainer = styled.div`
  display: flex;
  gap: 16px;

  & > label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #555;
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0rem;
`;

export const RemoveBtn = styled.button`
  background: transparent;
  border: none;
  color: #e00;
  cursor: pointer;
`;

export const OptionSection = styled.div`
  margin: 0.5rem 0;
`;

export const QuetionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;

  border-bottom-color: #eadede;

  &:focus-within {
    border-bottom-color: #888;
  }
`;

export const AddOptionBtn = styled.button`
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem 0;
  &:hover {
    text-decoration: underline;
  }
`;
