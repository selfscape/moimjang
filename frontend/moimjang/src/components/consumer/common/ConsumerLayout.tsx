import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { headerState, navigationState } from "recoils/atoms/consumer";
import styled, { CSSObject } from "styled-components";

import Navigation from "./Navigation";
import SystemModal from "./SystemModal";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
  style?: CSSObject;
}

const ConsumerLayout = ({ children, style }: Props) => {
  const header = useRecoilValue(headerState);
  const navigation = useRecoilValue(navigationState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {header.visible && (
        <Header
          title={header.title}
          onBack={header.onBack}
          onRefresh={header.onRefresh}
        />
      )}

      <Container style={style}>
        {children}
        {navigation.visible && <Navigation />}
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

  position: relative;
  margin: 0 auto;

  width: 100vw;
  max-width: 430px;
  min-height: 100vh;
  background-color: #fff;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  padding: 76px 16px 80px 16px;
`;

export default ConsumerLayout;
