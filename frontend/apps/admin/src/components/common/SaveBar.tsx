import { useRecoilState } from "recoil";
import styled from "styled-components";
import { saveBarState } from "recoils/atoms/saveBar";

const SaveBar = () => {
  const [saveBar] = useRecoilState(saveBarState);

  const handleConfirm = () => {
    if (saveBar.onSave) saveBar.onSave();
  };

  if (!saveBar.isVisible) return null;

  return (
    <Container>
      <SaveButton onClick={handleConfirm}>{saveBar.buttonText}</SaveButton>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1000;
`;

const SaveButton = styled.button`
  padding: 16px 32px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.palette.grey700};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default SaveBar;
