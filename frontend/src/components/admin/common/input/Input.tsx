import styled from "styled-components";

export const Input = styled.input.attrs({ type: "text" })<{
  textAlign?: string | undefined;
  disabled?: boolean;
}>`
  border: 1px solid ${({ theme: { palette } }) => palette.grey500};
  width: 320px;
  height: 32px;
  background-color: ${({ disabled, theme: { palette } }) =>
    disabled ? palette.grey100 : "#ffffff"};

  padding: 7px 8px;

  font-size: 12px;
  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  line-height: 18px;

  text-align: ${({ textAlign }) => textAlign};

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    cursor: default;
  `};
`;

export default Input;
