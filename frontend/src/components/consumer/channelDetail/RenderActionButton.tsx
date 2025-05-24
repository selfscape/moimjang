import styled from "styled-components";

const RenderActionButton = (
  bgColor: string,
  icon: JSX.Element,
  text: string,
  onClick: () => void
) => (
  <ActionButton bgColor={bgColor} onClick={onClick}>
    {icon}
    <ButtonText>{text}</ButtonText>
  </ActionButton>
);

export default RenderActionButton;

const ActionButton = styled.button<{ bgColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 12px;
  padding: 1.5rem 1.5rem;
  font-size: 1rem;
  gap: 0.5rem;
  cursor: pointer;
  color: #2f2b2b;
  background: ${({ bgColor }) => {
    switch (bgColor) {
      case "white":
        return "#f8f6f4";
    }
  }};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${({ bgColor }) => {
      switch (bgColor) {
        default:
          return "#f8f3d7";
      }
    }};
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonText = styled.span`
  font-weight: 500;
`;
