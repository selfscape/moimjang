import styled from "styled-components";
import { FaEnvelope } from "react-icons/fa";
import useGetUserById from "hooks/admin/users/useGetUserById";
import AdminLayout from "components/admin/common/AdminLayout";

const UserDetail = () => {
  const { data } = useGetUserById();

  if (!data) {
    return <LoadingMessage>데이터가 존재하지 않습니다...</LoadingMessage>;
  }

  // 성별 표시: "male" -> "남자", "female" -> "여자"
  const genderText =
    data.gender === "male" ? (
      "남자"
    ) : data.gender === "female" ? (
      "여자"
    ) : (
      <EmptyText>정보 없음</EmptyText>
    );

  const formattedCreatedAt = data.created_at ? (
    new Date(data.created_at).toLocaleDateString()
  ) : (
    <EmptyText>정보 없음</EmptyText>
  );

  return (
    <AdminLayout>
      <ProfileContainer>
        <ProfileCard>
          <Header>
            <UserNameContainer>
              <h1>{data.username || <EmptyText>정보 없음</EmptyText>}</h1>
              <SubInfo>
                <FaEnvelope /> {data.email || <EmptyText>정보 없음</EmptyText>}
              </SubInfo>
            </UserNameContainer>
          </Header>
          <SectionGrid>
            {/* 개인 정보 섹션 */}
            <Section>
              <SectionTitle>📌 개인 정보</SectionTitle>
              <InfoBlock>
                <InfoTitle>성별</InfoTitle>
                <InfoContent>{genderText}</InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>출생년도</InfoTitle>
                <InfoContent>
                  {data.birth_year || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>MBTI</InfoTitle>
                <InfoContent>
                  {data.mbti || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>취미</InfoTitle>
                <InfoContent>
                  {data.hobby || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
            </Section>

            {/* 추가 정보 섹션 */}
            <Section>
              <SectionTitle>🔎 추가 정보</SectionTitle>
              <InfoBlock>
                <InfoTitle>강점</InfoTitle>
                <InfoContent>
                  {data.strength || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>행복한 순간</InfoTitle>
                <InfoContent>
                  {data.happyMoment || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>키워드</InfoTitle>
                <InfoContent>
                  {data.keywords ? (
                    <KeywordList>
                      {data.keywords.split(",").map((keyword) => (
                        <Keyword key={keyword.trim()}>{keyword.trim()}</Keyword>
                      ))}
                    </KeywordList>
                  ) : (
                    <EmptyText>정보 없음</EmptyText>
                  )}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>선호 미디어</InfoTitle>
                <InfoContent>
                  {data.favorite_media || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>TMI</InfoTitle>
                <InfoContent>
                  {data.tmi || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
            </Section>

            {/* 계정 정보 섹션 */}
            <Section>
              <SectionTitle>🔐 계정 정보</SectionTitle>
              <InfoBlock>
                <InfoTitle>가입일</InfoTitle>
                <InfoContent>{formattedCreatedAt}</InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>회원 ID</InfoTitle>
                <InfoContent>
                  {data.id || <EmptyText>정보 없음</EmptyText>}
                </InfoContent>
              </InfoBlock>
            </Section>

            {/* 참여한 채널 정보 섹션 */}
            <Section>
              <SectionTitle>📝 참여한 채널</SectionTitle>
              <InfoBlock>
                <InfoTitle>채널명</InfoTitle>
                <InfoContent>
                  {data.joined_channel?.title || (
                    <EmptyText>정보 없음</EmptyText>
                  )}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>카테고리</InfoTitle>
                <InfoContent>
                  {data.joined_channel?.brand_title || (
                    <EmptyText>정보 없음</EmptyText>
                  )}
                </InfoContent>
              </InfoBlock>
              <InfoBlock>
                <InfoTitle>이벤트 날짜</InfoTitle>
                <InfoContent>
                  {data.joined_channel?.event_date || (
                    <EmptyText>정보 없음</EmptyText>
                  )}
                </InfoContent>
              </InfoBlock>
            </Section>
          </SectionGrid>
        </ProfileCard>
      </ProfileContainer>
    </AdminLayout>
  );
};

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileCard = styled.div`
  background: #ffffff;
  max-width: 1000px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 30px 40px;
  border-bottom: 1px solid #e1e8ed;
  background: #f7fafc;
`;

const UserNameContainer = styled.div`
  h1 {
    font-size: 2.2rem;
    margin: 0;
    color: #2d3748;
    font-weight: 700;
  }
`;

const SubInfo = styled.p`
  font-size: 1rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 40px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
  margin-bottom: 12px;
  color: #2d3748;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f7fafc;
  margin-bottom: 16px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 8px;
`;

const InfoContent = styled.div`
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const KeywordList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Keyword = styled.span`
  background: #bee3f8;
  color: #2b6cb0;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
`;

const EmptyText = styled.span`
  color: #a0aec0;
  font-style: italic;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #718096;
`;

export default UserDetail;
