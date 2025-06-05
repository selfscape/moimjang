import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Pathnames } from "constants/index";
import useCheckUserRole from "hooks/auth/useCheckUserRole";
import { useRecoilState } from "recoil";
import userState from "recoils/atoms/auth/userState";

const ManagementTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userData] = useRecoilState(userState);
  const { isSuperAdmin, isAdmin } = useCheckUserRole(userData?.role);

  const handleTabClick = (pathName: Pathnames) => {
    navigate(pathName);
  };

  return (
    <Container>
      <Tabs>
        {isSuperAdmin && (
          <Tab
            isActive={
              location.pathname.includes(Pathnames.Submission) ||
              (location.pathname === "/admin" && isSuperAdmin)
            }
            onClick={() => handleTabClick(Pathnames.Submission)}
          >
            신청
          </Tab>
        )}

        {isAdmin && (
          <Tab
            isActive={
              location.pathname.includes(Pathnames.Host) ||
              (location.pathname === "/admin" && isAdmin)
            }
            onClick={() => handleTabClick(Pathnames.Host)}
          >
            모임장
          </Tab>
        )}

        <Tab
          isActive={location.pathname.includes(Pathnames.Channel)}
          onClick={() => handleTabClick(Pathnames.Channel)}
        >
          소셜링
        </Tab>
        <Tab
          isActive={location.pathname.includes(Pathnames.Brand)}
          onClick={() => handleTabClick(Pathnames.Brand)}
        >
          브랜드
        </Tab>

        <Tab
          isActive={location.pathname.includes(Pathnames.User)}
          onClick={() => handleTabClick(Pathnames.User)}
        >
          유저
        </Tab>
        <Tab
          isActive={location.pathname.includes(Pathnames.Landing)}
          onClick={() => handleTabClick(Pathnames.Landing)}
        >
          메인 페이지
        </Tab>
      </Tabs>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Tabs = styled.div`
  display: flex;
  background-color: ${({ theme: { palette } }) => palette.grey100};
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 174px;
  padding: 20px 0px;
  cursor: pointer;
  background-color: ${({ theme: { palette }, isActive }) =>
    isActive ? palette.grey700 : "transparent"};
  color: ${({ theme: { palette }, isActive }) =>
    isActive ? palette.white : palette.grey900};
  ${({ theme }) => theme.font.korean.emphasized.title2};
  position: relative;
`;

const SubTabs = styled.div`
  position: absolute;
  top: 48px; /* 메인 탭 아래 위치 */
  left: 174px; /* 채널 탭 아래 정렬 */
  width: 174px;
  background-color: ${({ theme }) => theme.palette.grey300};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  z-index: 1000;
`;

const SubTab = styled.div<{ isActive: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.palette.grey400};

  color: ${({ theme, isActive }) =>
    isActive ? theme.palette.black : theme.palette.grey900};

  &:hover {
    font-weight: 900;
    background-color: ${({ theme }) => theme.palette.grey500};
  }

  ${({ theme }) => theme.font.korean.normal.body2};
`;

export default ManagementTabs;
