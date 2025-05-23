import { useBrandFormContext } from "hooks/admin/brand/context/useBrandFormContext";
import React from "react";
import styled from "styled-components";

const MeetingLocation = () => {
  const { brand, setBrand } = useBrandFormContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrand({
      ...brand,
      [name]: value,
    });
  };

  return (
    <Container>
      <Title>장소 정보</Title>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Input
            type="text"
            name="meeting_location"
            value={brand.meeting_location ?? ""}
            onChange={handleInputChange}
            placeholder="모임장소를 입력하세요"
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Input
            type="text"
            name="location_link"
            value={brand.location_link ?? ""}
            onChange={handleInputChange}
            placeholder="장소링크를 입력하세요"
          />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
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

const WarningMessage = styled.div`
  margin-top: 4px;
  color: red;
  font-size: 0.875rem;
`;

export default MeetingLocation;
