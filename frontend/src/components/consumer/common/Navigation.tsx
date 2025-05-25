import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaHome } from "react-icons/fa";
import { Pathnames } from "constants/admin/index";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (pathName: string) => {
    navigate(pathName);
  };

  return (
    <Container>
      <BottomNavContainer>
        <NavItem
          isActive={location.pathname !== Pathnames.Profile}
          onClick={() => handleButtonClick(Pathnames.Home)}
        >
          <NavIcon>
            <FaHome />
          </NavIcon>
          <NavText>홈</NavText>
        </NavItem>

        <NavItem
          isActive={location.pathname.includes(Pathnames.Profile)}
          onClick={() => handleButtonClick(Pathnames.Profile)}
        >
          <NavIcon>
            <FaUser />
          </NavIcon>
          <NavText>프로필</NavText>
        </NavItem>
      </BottomNavContainer>
    </Container>
  );
};

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
`;

const BottomNavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 4rem;
`;

const NavItem = styled.button<{ isActive: boolean }>`
  // a -> button 변경
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.isActive ? "#3b82f6" : "#9ca3af")};
`;

const NavIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const NavText = styled.span`
  font-size: 0.75rem;
`;

export default Navigation;
