import { css } from "styled-components";

export const addEllipsis = (line: number) => {
  return css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: -webkit-box;
    -webkit-line-clamp: ${line};
    -webkit-box-orient: vertical;
  `;
};

export const textEllipsis = (lineClamp: string) => {
  return lineClamp === "1"
    ? css`
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      `
    : css`
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: ${lineClamp};
        -webkit-box-orient: vertical;
      `;
};
