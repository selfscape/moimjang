import styled from "styled-components";

const TextArea = styled.textarea<{
  disabled?: boolean;
}>`
  width: 600px;
  height: 56px;

  padding: 9px 8px;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.palette.grey500};

  font-family: "Spoqa Han Sans Neo";
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.1px;

  resize: none;
`;

export default TextArea;
