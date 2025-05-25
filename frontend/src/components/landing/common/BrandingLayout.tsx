import SystemModal from "components/consumer/common/SystemModal";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { headerState } from "recoils/atoms/landing";
import styled, { CSSObject } from "styled-components";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
  style?: CSSObject;
}

const BrandingLayout = ({ children, style }: Props) => {
  const header = useRecoilValue(headerState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {header.visible && <Header title={header.title} onBack={header.onBack} />}

      <Container style={style}>
        {children}
        <SystemModal />
      </Container>
    </>
  );
};

const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin: 0 auto;

  width: 100vw;
  max-width: 430px;
  height: 100vh;
  background-color: #fff;
`;

export default BrandingLayout;
