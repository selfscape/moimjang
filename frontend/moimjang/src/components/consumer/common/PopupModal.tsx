// PopupModal.tsx
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { popupModalState } from "recoils/atoms/common/modal";

const PopupModal: React.FC = () => {
  const [popup, setPopup] = useRecoilState(popupModalState);

  // Handle closing the popup modal with the ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && popup.isOpen) {
        if (popup.onClose) popup.onClose();
        setPopup({ ...popup, isOpen: false });
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [popup, setPopup]);

  if (!popup.isOpen) return null;

  const handleConfirm = () => {
    if (popup.onConfirm) popup.onConfirm();
    setPopup({ ...popup, isOpen: false });
  };

  const handleClose = () => {
    if (popup.onClose) popup.onClose();
    setPopup({ ...popup, isOpen: false });
  };

  // Close the popup if clicking outside the content area
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <PopupOverlay onClick={handleOverlayClick}>
      <PopupContainer>
        {popup.content}

        <ButtonGroup>
          <Button variant="cancel" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </ButtonGroup>
      </PopupContainer>
    </PopupOverlay>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
  z-index: 2000; /* Higher than the system modal */
`;

const PopupContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: "cancel" | "confirm" }>`
  padding: 0.5rem 1rem;
  background: ${({ variant }) => (variant === "cancel" ? "#ccc" : "#007BFF")};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export default PopupModal;
