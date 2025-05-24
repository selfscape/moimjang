import React from "react";
import styled from "styled-components";
import { FaArrowLeft, FaSync } from "react-icons/fa";

interface HeaderProps {
  title: string;
  onRefresh?: () => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, onRefresh }) => {
  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <FixedHeaderContainer>
      <HeaderContent>
        {onBack ? (
          <BackButton onClick={handleBackButtonClick}>
            <FaArrowLeft size={24} />
          </BackButton>
        ) : (
          <Placeholder />
        )}
        <Title>{title}</Title>
        {onRefresh ? (
          <RefreshButton onClick={onRefresh}>
            <FaSync size={24} />
          </RefreshButton>
        ) : (
          <Placeholder />
        )}
      </HeaderContent>
    </FixedHeaderContainer>
  );
};

export default Header;

const FixedHeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* 헤더 높이 */
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2d3748;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2d3748;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
`;

const Placeholder = styled.div`
  width: 24px;
`;
