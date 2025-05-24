import { useBrandFormContext } from "hooks/admin/brand/context/useBrandFormContext";
import styled from "styled-components";

const SocialingDuration: React.FC = () => {
  const { brand, setBrand } = useBrandFormContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrand({
      ...brand,
      [name]: value === "" ? 0 : parseInt(value, 10),
    });
  };

  return (
    <Container>
      <Title>진행 시간 설정</Title>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          type="number"
          name="socialing_duration"
          value={brand.socialing_duration < 0 ? 0 : brand.socialing_duration}
          onChange={handleInputChange}
          placeholder="진행 시간 (분)"
        />
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

export default SocialingDuration;
