import styled from "styled-components";
import AdminLayout from "components/admin/common/AdminLayout";
import useCreateHostRegist from "api/admin/hostRegist/useCreateHostRegist";
import useSystemModal from "hooks/common/components/useSystemModal";

const GuestPage = () => {
  const { mutate: createHostRegist } = useCreateHostRegist();
  const { showAnyMessageModal } = useSystemModal();

  const handleApply = () => {
    createHostRegist(undefined, {
      onSuccess: () => {
        showAnyMessageModal(
          `
관리자 신청이 완료되었어요!  
확인을 위해 인스타그램 DM도
함께 부탁드릴게요 :)
          `
        );
      },
      onError: (error) => {
        showAnyMessageModal(`신청 중 오류가 발생했습니다: ${error.message}`);
      },
    });
  };

  return (
    <AdminLayout>
      <Container>
        <Card>
          <Title>📢 모임장 신청 안내</Title>
          <Text>
            현재 이 페이지는
            <br />
            게스트 전용 페이지입니다.
            <br />
            모임장 플랫폼의
            <br />
            모임장으로 활동하고 싶으신가요?
          </Text>

          <Text>
            ✅ 어드민 신청을 원하신다면
            <br />
            아래 [신청하기] 버튼을 눌러주세요.
            <br />
            <br />
            신청 후,
            <br />
            아래 인스타그램 계정으로 DM을 보내주시면
            <br />
            신청 결과를 알려드립니다!
          </Text>
          <DM>
            📩 인스타그램 DM:{" "}
            <InstagramLink
              href="https://instagram.com/iron__readers"
              target="_blank"
            >
              @iron__readers
            </InstagramLink>
            <InstagramLink href="https://instagram.com/neo_hcy" target="_blank">
              @neo_hcy
            </InstagramLink>
          </DM>
          <Text>
            신청 완료 후, 관리자의 승인을 기다려주세요.
            <br />
            승인 완료 시, 로그인 후 관리자 페이지를
            <br />
            정상적으로 이용하실 수 있습니다.
          </Text>
          <ApplyButton onClick={handleApply}>신청하기</ApplyButton>
        </Card>
      </Container>
    </AdminLayout>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  padding: 32px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const DM = styled.p`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  font-weight: 500;
`;

const InstagramLink = styled.a`
  color: #3897f0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ApplyButton = styled.button`
  margin-top: 24px;
  padding: 14px 0;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  background: #4a90e2;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #357ab8;
  }
`;

export default GuestPage;
