import styled from "styled-components";
import { Box } from ".";

export const ContainerFluid = styled(Box)``;
ContainerFluid.defaultProps = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
};
export const Container = styled(Box)``;
Container.defaultProps = {
  width: "100%",
  maxWidth: "1440px",
  px: [3],
};
export const ContainerMin = styled(Box)``;
ContainerMin.defaultProps = {
  width: "100%",
  maxWidth: "800px",
  px: [3],
};

interface FlexProps {
  row?: boolean;
  col?: boolean;
  flexFull?: boolean;
  center?: boolean;
  justifyCenter?: boolean;
  alignCenter?: boolean;
  spaceBetween?: boolean;
  spaceAround?: boolean;
  alignBaseline?: boolean;
}
export const Flex = styled(Box)<FlexProps>`
  flex-direction: ${(p) => (p.row ? "row" : p.col ? "column" : "")};
  flex-grow: ${(p) => (p.flexFull ? "1" : "")};
  justify-content: ${(p) =>
    p.center
      ? "center"
      : p.justifyCenter
      ? "center"
      : p.spaceBetween
      ? "space-between"
      : p.spaceAround
      ? "space-around"
      : ""};
  align-items: ${(p) =>
    p.center
      ? "center"
      : p.alignCenter
      ? "center"
      : p.alignBaseline
      ? "baseline"
      : ""};
`;
Flex.defaultProps = {
  display: "flex",
};
