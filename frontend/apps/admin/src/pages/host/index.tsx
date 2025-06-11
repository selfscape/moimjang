import { useCallback } from "react";
import styled from "styled-components";

import AdminLayout from "components/common/AdminLayout";
import RequireAuth from "components/common/RequireAuth";
import useOwnerCookie from "hooks/auth/useOwnerCookie";

const Host = () => {
  const hostName = useOwnerCookie();

  const contentSiteUrl = `https://contents.moimjang.com/?host=${hostName}`;
  const sellerSiteUrl = `https://seller.moimjang.com?host=${hostName}`;
  const adminSiteUrl = `https://admin.moimjang.com/login?host=${hostName}`;

  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
  }, []);

  return (
    <AdminLayout>
      <Container>
        <Wrapper>
          <InfoCard>
            <InfoContent>
              <InfoLabel>관리자 페이지 URL</InfoLabel>
              <InfoLink
                href={adminSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {adminSiteUrl}
              </InfoLink>
            </InfoContent>
            <CopyButton onClick={() => handleCopy(adminSiteUrl)}>
              Copy
            </CopyButton>
          </InfoCard>
          <InfoCard>
            <InfoContent>
              <InfoLabel>소개 페이지 URL</InfoLabel>
              <InfoLink
                href={sellerSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sellerSiteUrl}
              </InfoLink>
            </InfoContent>
            <CopyButton onClick={() => handleCopy(sellerSiteUrl)}>
              Copy
            </CopyButton>
          </InfoCard>
          <InfoCard>
            <InfoContent>
              <InfoLabel>컨텐츠 사이트 URL</InfoLabel>
              <InfoLink
                href={contentSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contentSiteUrl}
              </InfoLink>
            </InfoContent>
            <CopyButton onClick={() => handleCopy(contentSiteUrl)}>
              Copy
            </CopyButton>
          </InfoCard>
        </Wrapper>
      </Container>
    </AdminLayout>
  );
};

const Container = styled.div`
  padding: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;

  max-width: 600px;
  background: #f0f2f5;
`;

const InfoCard = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const InfoLabel = styled.span`
  display: block;
  font-weight: bold;
  margin-bottom: 12px;
`;

const InfoLink = styled.a`
  color: #0070f3;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
`;

const CopyButton = styled.button`
  margin-left: 16px;
  padding: 10px 16px;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  background-color: ${({ theme }) => theme.palette.grey700};

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey900};
  }
`;

const Notice = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 12px;
  align-self: flex-start;
  padding: 0 24px;
`;

export default RequireAuth(Host);
