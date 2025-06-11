import styled, { css } from "styled-components";

const sizeStyles = css<{ size: string }>`
  ${({ size }) =>
    size === "xsmall" &&
    css`
      height: 24px;
      padding: 5px 8px;

      font-size: 10px;
      font-weight: 300;
      line-height: 14px;
      letter-spacing: 0.1px;
    `}

  ${({ size }) =>
    size === "small" &&
    css`
      height: 32px;
      padding: 9px 16px;

      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.1px;
    `}

  ${({ size }) =>
    size === "big" &&
    css`
      height: 48px;
      padding: 15px 20px;

      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      letter-spacing: -0.015em;
    `}
`;

const Button = styled.button.attrs({ type: "button" })<{
  width?: string;
  style?: React.CSSProperties;
  size: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;

  ${sizeStyles};
  ${({ style }) => style && { ...style }}

  border: 1px solid
    ${({ backgroundColor, theme: { palette } }) =>
    backgroundColor ? backgroundColor : palette.grey500};

  border-color: ${({ borderColor }) => (borderColor ? borderColor : "")};
  color: ${({ color }) => (color ? color : "black")};

  background-color: ${({ backgroundColor, theme: { palette } }) =>
    backgroundColor ? backgroundColor : palette.white};

  font-family: "Spoqa Han Sans Neo";
  word-break: keep-all;
  white-space: nowrap;
  cursor: pointer;

  &.positive {
    background-color: ${({ theme: { palette } }) => palette.grey700};
    border: none;
    color: ${({ theme: { palette } }) => palette.white};
  }

  &:disabled {
    background-color: ${({ theme }) => `${theme.palette.grey300} !important`};
    border: none !important;
    color: ${({ theme }) => `${theme.palette.grey500} !important`};

    cursor: default;
    pointer-events: none;
  }
`;

export default Button;
