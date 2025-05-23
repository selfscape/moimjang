import { useBrandFormContext } from "hooks/admin/brand/context/useBrandFormContext";
import React from "react";
import styled from "styled-components";

const DescriptionInput: React.FC = () => {
  const { brand, setBrand } = useBrandFormContext();

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrand({
      ...brand,
      [name]: value,
    });
  };

  return (
    <FieldGroup>
      <Title>설명</Title>
      <Input
        name="description"
        value={brand.description}
        onChange={handleTextAreaChange}
        placeholder="소셜링 설명을 입력하세요"
      />
    </FieldGroup>
  );
};

export default DescriptionInput;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
`;

const Input = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  height: 150px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  }
`;
