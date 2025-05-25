import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Pathnames } from "constants/admin";
import BrandingLayout from "components/landing/common/BrandingLayout";

const SubmissionComplete = () => {
  const navigate = useNavigate();

  return (
    <BrandingLayout>
      <Container>
        <Emoji>🥳</Emoji>
        <Title>신청이 완료되었습니다</Title>
        <Message>
          소중한 신청 감사드립니다. <br />
          빠른 시일 내에 검토 후 연락드리겠습니다.
        </Message>
        <ButtonWrapper>
          <ActionButton onClick={() => navigate(Pathnames.Landing)}>
            홈으로 돌아가기
          </ActionButton>
        </ButtonWrapper>
      </Container>
    </BrandingLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  height: 100%;

  max-width: 430px;
  margin: 0 auto;
  padding: 100px 20px;
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bb5;
  }
`;

export default SubmissionComplete;
