import React, { useState } from "react";
import styled from "styled-components";

interface CertificationCounts {
  [user: string]: number;
}

const Habit: React.FC = () => {
  const [certifications, setCertifications] = useState<CertificationCounts>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processTextData(text);
    };
    reader.readAsText(file);
  };

  const processTextData = (text: string) => {
    const lines = text.split("\n");
    const userCerts: Record<string, Record<string, boolean>> = {};

    lines.forEach((line) => {
      const match = line.match(
        /(\d{4})\.\s(\d{1,2})\.\s(\d{1,2})\.\s(\d{2}):(\d{2}),\s(.+?)\s:\s(.+)/
      );

      if (match) {
        let [_, year, month, day, hour, minute, user, message] = match;
        let date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );

        // 인증 시간이 0~1시이면 전날로 간주
        if (date.getHours() < 2) {
          date.setDate(date.getDate() - 1);
        }

        const formattedDate = `${date.getFullYear()}. ${
          date.getMonth() + 1
        }. ${date.getDate()}`;

        if (!userCerts[user]) {
          userCerts[user] = {};
        }

        if (
          (message.includes("인증완료") ||
            message.includes("인증 완료") ||
            message.includes("인증") ||
            message.includes("사진")) &&
          !userCerts[user][formattedDate]
        ) {
          userCerts[user][formattedDate] = true;
        }
      }
    });

    const finalCounts: CertificationCounts = {};
    Object.keys(userCerts).forEach((user) => {
      finalCounts[user] = Object.keys(userCerts[user]).length;
    });

    setCertifications(finalCounts);
  };

  // 인증 횟수 내림차순 정렬
  const sortedCertifications = Object.entries(certifications).sort(
    (a, b) => b[1] - a[1]
  );

  // 순위에 따라 아이콘 또는 텍스트 반환
  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}등`;
  };

  return (
    <Container>
      <Title>📂 인증 횟수 카운터</Title>
      <FileInput type="file" accept=".txt" onChange={handleFileUpload} />
      <Subtitle>✅ 참가자별 인증 횟수 (순위별)</Subtitle>
      <List>
        {sortedCertifications.map(([user, count], index) => (
          <ListItem key={user}>
            <RankingBadge>{getRankIcon(index)}</RankingBadge>
            <UserInfo>
              <strong>{user}</strong>: {count}회 인증 완료
            </UserInfo>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 16px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  font-family: "Roboto", sans-serif;
  text-align: center;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 24px;
  font-size: 2rem;
`;

const Subtitle = styled.h3`
  color: #34495e;
  margin: 20px 0;
`;

const FileInput = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  border: 2px dashed #2980b9;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  background: #ecf0f1;
  transition: background 0.3s, border-color 0.3s;

  &:hover {
    border-color: #3498db;
    background: #d0e6f7;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  background: #fff;
  margin: 10px 0;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const RankingBadge = styled.span`
  font-size: 1.5rem;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
  text-align: left;
`;

export default Habit;
