import React, { FC } from "react";
import styled from "styled-components";
import { FaWindowClose } from "react-icons/fa";

interface PopupImageModalProps {
  src: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PopupImageModal: FC<PopupImageModalProps> = ({
  src,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !src) return null;
  return (
    <Container onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaWindowClose />
        </CloseButton>
        <EnlargedImg src={src} alt="Enlarged" />
      </ModalContent>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 4px;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
`;

const EnlargedImg = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
`;

export default PopupImageModal;
