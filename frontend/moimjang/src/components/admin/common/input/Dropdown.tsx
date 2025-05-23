import styled from "styled-components";

import downwordArrowMedium from "assets/icons/arrow-downward-medium.svg";
import downwordArrowBig from "assets/icons/arrow-downward-big.svg";

export const Selector = styled.select<{
  width?: string;
}>`
  display: flex;
  width: ${({ width }) => (width ? width : "119px")};
  height: 32px;
  padding: 0px 12px 0px 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey500};

  background-image: url(${downwordArrowMedium});
  background-repeat: no-repeat;
  background-position: right;
  background-color: ${({ theme }) => theme.palette.white};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Option = styled.option`
  font-family: "Spoqa Han Sans Neo";
  color: grey;
`;
