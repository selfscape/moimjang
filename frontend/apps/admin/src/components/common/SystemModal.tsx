// SystemModal.tsx
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { systemModalState } from "recoils/atoms/common/modal";

const SystemModal: React.FC = () => {
  const [modal, setModal] = useRecoilState(systemModalState);

  // ESC 키로 모달 닫기 처리
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.isOpen) {
        if (modal.onCancel) modal.onCancel();
        setModal({ ...modal, isOpen: false });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modal, setModal]);

  if (!modal.isOpen) return null;

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    setModal({ ...modal, isOpen: false });
  };

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
    setModal({ ...modal, isOpen: false });
  };

  // 모달 영역 외부 클릭 시 닫기 처리
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        {modal.title && <Title>{modal.title}</Title>}
        {modal.message && <Message>{modal.message}</Message>}
        <ButtonGroup>
          {modal.showCancel && (
            <Button variant="cancel" onClick={handleCancel}>
              {modal.cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm}>{modal.confirmText}</Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

const Title = styled.h2`
  white-space: pre-line;

  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  line-height: 1.2;
`;

const Message = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-line;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "cancel" | "confirm" }>`
  padding: 0.5rem 1rem;
  background: ${({ variant, theme: { palette } }) =>
    variant === "cancel" ? "#ccc" : palette.grey700};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export default SystemModal;
