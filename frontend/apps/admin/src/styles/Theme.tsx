import { DefaultTheme } from "styled-components";

const palette = {
  white: "#fff",
  black: "#000",
  grey900: "#192033",
  grey700: "#414A5B",
  grey600: "#898C8E",
  grey500: "#BBC0C6",
  grey400: "#DFE2E6",
  grey300: "#ECEEEF",
  grey100: "#F4F7F9",
  red900: "#EA2715",
  red500: "#FFA59C",
  blue100: "#EFF9FF",
  blue900: "#0D99FF",
  yellow100: "#FFFCEF",
};

const shadow = {
  boxShadow: "7px 10px 8px rgba(0, 0, 0, 0.1)",
};

export const font = {
  korean: {
    normal: {
      largeTitle: `
        font-family: Spoqa Han Sans Neo;
        font-size: 25px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title1: `
        font-family: Spoqa Han Sans Neo;
        font-size: 18px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title2: `
        font-family: Spoqa Han Sans Neo;
        font-size: 16px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title3: `
        font-family: Spoqa Han Sans Neo;
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      headLine: `
        font-family: Spoqa Han Sans Neo;
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      subHead: `
        font-family: Spoqa Han Sans Neo;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      body1: `
        font-family: Spoqa Han Sans Neo;
        font-size: 12px;
        font-weight: 500;
        line-height: 14px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      body2: `
        font-family: Spoqa Han Sans Neo;
        font-size: 12px;
        font-weight: 300;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      caption1: `
        font-family: Spoqa Han Sans Neo;
        font-size: 10px;
        font-weight: 300;
        line-height: 14px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,
    },

    emphasized: {
      largeTitle: `
        font-family: Spoqa Han Sans Neo;
        font-size: 25px;
        font-weight: 700;
        line-height: 24px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title1: `
        font-family: Spoqa Han Sans Neo;
        font-size: 18px;
        font-weight: 700;
        line-height: 24px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title2: `
        font-family: Spoqa Han Sans Neo;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title3: `
        font-family: Spoqa Han Sans Neo;
        font-size: 15px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      headLine: `
        font-family: Spoqa Han Sans Neo;
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      subHead: `
        font-family: Spoqa Han Sans Neo;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      body1: `
        font-family: Spoqa Han Sans Neo;
        font-size: 12px;
        font-weight: 700;
        line-height: 14px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      body2: `
        font-family: Spoqa Han Sans Neo;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,

      caption1: `
        font-family: Spoqa Han Sans Neo;
        font-size: 10px;
        font-weight: 500;
        line-height: 14px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,
    },
  },
  english: {
    emphasized: {
      title1: `
        font-family: Helvetica;
        font-size: 20px;
        font-weight: 700;
        line-height: 22px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title2: `
        font-family: Helvetica;
        font-size: 17px;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: -0.015em;
        text-align: left;
      `,

      title3: `
        font-family: Helvetica;
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        letter-spacing: -0.015em;
        text-align: left;
      `,
    },
  },
};

const theme: DefaultTheme = {
  palette,
  shadow,
  font,
};

export default theme;
