import styled from "styled-components/macro";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      white: string;
      black: string;
      grey900: string;
      grey700: string;
      grey600: string;
      grey500: string;
      grey400: string;
      grey300: string;
      grey100: string;
      red900: string;
      red500: string;
      blue100: string;
      blue900: string;
      yellow100: string;
    };
    shadow: {
      boxShadow: string;
    };
    font: {
      korean: {
        normal: {
          largeTitle: string;
          title1: string;
          title2: string;
          title3: string;
          headLine: string;
          subHead: string;
          body1: string;
          body2: string;
          caption1: string;
        };
        emphasized: {
          largeTitle: string;
          title1: string;
          title2: string;
          title3: string;
          headLine: string;
          subHead: string;
          body1: string;
          body2: string;
          caption1: string;
        };
      };
      english: {
        emphasized: {
          title1: string;
          title2: string;
          title3: string;
        };
      };
    };
  }

  export const createGlobalStyle;
}
