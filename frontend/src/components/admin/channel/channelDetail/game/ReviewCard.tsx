import { Review } from "interfaces/channels";
import styled from "styled-components";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const extractContact = (info: string) => {
    if (!info) return { instagram: "", kakao: "", phone: "" };
    const instagramMatch = info.match(/Instagram:\s*([^,]+)/i);
    const kakaoMatch = info.match(/Kakao:\s*([^,]+)/i);
    const phoneMatch = info.match(/Phone:\s*([^\s,]+)/i);
    return {
      instagram: instagramMatch ? instagramMatch[1].trim() : "",
      kakao: kakaoMatch ? kakaoMatch[1].trim() : "",
      phone: phoneMatch ? phoneMatch[1].trim() : "",
    };
  };

  const contact = extractContact(review.additional_info);
  const parseList = (text: string) =>
    text
      ? text
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const styleList = parseList(review.style);
  const impressionList = parseList(review.impression);
  const conversationList = parseList(review.conversation);
  const genderIcon = review.reviewer_user_gender === "male" ? "🙋‍♂️" : "🙋‍♀️";

  return (
    <Card>
      <ReviewHeader>
        <ReviewerInfo>
          <span>
            {review.is_reviewer_anonymous
              ? `작성자:👤 비공개`
              : `작성자:${genderIcon} ${review.reviewer_user_name}`}
          </span>
        </ReviewerInfo>
      </ReviewHeader>
      <Section>
        <SectionTitle>
          <Icon>👕 </Icon>
          "스타일"
        </SectionTitle>
        <List>
          {styleList.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SectionTitle>
          <Icon>😎</Icon>
          "첫인상"
        </SectionTitle>
        <List>
          {impressionList.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SectionTitle>
          <Icon>💬</Icon>
          "대화 중 와닿았던 부분"
        </SectionTitle>
        <List>
          {conversationList.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Section>
      {review.keywords && review.keywords.trim() !== "" && (
        <Section>
          <SectionTitle>
            <Icon>💡</Icon>
            어울리는 "키워드"
          </SectionTitle>
          <KeywordList>
            {review.keywords.split(",").map((keyword, index) => (
              <Keyword key={index}>{keyword.trim()}</Keyword>
            ))}
          </KeywordList>
        </Section>
      )}

      {(contact.instagram || contact.kakao || contact.phone) && (
        <Section>
          <SectionTitle>연락처</SectionTitle>
          <ContactInfo>
            {contact.instagram && (
              <ContactItem>
                <strong>Instagram:</strong>{" "}
                <a
                  href={`https://www.instagram.com/${contact.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.instagram}
                </a>
              </ContactItem>
            )}
            {contact.kakao && (
              <ContactItem>
                <strong>Kakao:</strong> {contact.kakao}
              </ContactItem>
            )}
            {contact.phone && (
              <ContactItem>
                <strong>Phone:</strong> {contact.phone}
              </ContactItem>
            )}
          </ContactInfo>
        </Section>
      )}
    </Card>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
`;

// 개선된 ReviewerInfo 스타일링 (작성자 정보 명시)
const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  font-family: "Arial", sans-serif;
  margin-bottom: 8px;
`;

const Section = styled.div`
  margin-top: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  line-height: 1.6;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  color: #333333;
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

const ListItem = styled.li`
  font-size: 16px;
  line-height: 1.6;
  color: #555555;
  margin-bottom: 4px;
  &::before {
    content: "•";
    color: #2563eb;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`;

const ContactInfo = styled.div`
  font-size: 16px;
  color: #555555;
`;

const ContactItem = styled.div`
  margin-bottom: 8px;
  a {
    color: #2563eb;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Keyword = styled.span`
  padding: 6px 12px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 14px;
`;

export default ReviewCard;
