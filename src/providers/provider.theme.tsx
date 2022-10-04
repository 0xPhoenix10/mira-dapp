import React from "react";
import { ThemeProvider } from "styled-components";

type ThemesProviderProps = {
  children?: React.ReactNode;
};

const ThemesProvider: React.FC<ThemesProviderProps> = ({ children }) => {
  const theme = () => {
    return {
      breakpoints: ["375px", "768px", "1024px", "1360px", "1600px", "1920px"],
      space: [0, 4, 8, 16, 32, 64],
      // margin, margin-top, margin-right, margin-bottom, margin-left, padding, padding-top, padding-right, padding-bottom, padding-left, grid-gap, grid-column-gap, grid-row-gap
      fontSizes: [12, 14, 16, 20, 24, 32],
      // font-size
      colors: {
        white: "#ffffff",
        darkWhite: "#B9B9B9",
        black: "#000000",
        blueBlack: "#0E1F28",
        lightBlueBlack: "#152630",
        darkBlueBlack: "#0B181F",
        gray: "#A0AEC0",
        gray2: "#A8A8A8",
        lightGray: "#CBD5E1",
        darkGray: "#718096",
        darkerGray: "#1E1E1F",
        cyan: "#67C5D9",
        green: "#48BB78",
        red: "#E53E3E",

        // lightpurple: "#000",
        // darkpurple: "#000",
        // yellow: "#000",
        // lightgray: "#000",
        // gray: "#000",
        // darkgray: "#000",
        // black: "#000",
      },
      // color, background-color, border-color
      fonts: [],
      // font-family
      fontWeights: [500, 600, 700, 800],
      // font-weight
      lineHeights: [12, 14, 16, 20, 24, 32],
      // line-height
      letterSpacings: [],
      // letter-spacing
      sizes: { mainHeader: "80px" },
      // width, height, min-width, max-width, min-height, max-height
      borders: [],
      // border, border-top, border-right, border-bottom, border-left
      borderWidths: [],
      // border-width
      borderStyles: [],
      // border-style
      radii: [],
      // border-radius
      shadows: [],
      // box-shadow, text-shadow
      zIndices: [],
      // z-index
      // -------------------- user --------------------
      // transforms: ["translateX(50%)", "translateX(50%)", "translateX(50%)", "unset"],
      // gradients: {
      //   main: "linear-gradient(180deg, #44C098 0%, #10956D 100%)",
      // },
    };
  };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemesProvider;
