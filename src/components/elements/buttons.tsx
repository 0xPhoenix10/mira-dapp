import { Box, Link } from "components/base";
import styled from "styled-components";

interface ArtButtonProps {
  borderWidth?: string;
  borderRadius?: string;
  padding?: string;
  btnColor?: string;
  onClick?: any;
  [index: string]: any;
}
export const ArtButton: React.FC<ArtButtonProps> = ({
  borderWidth = "3px",
  borderRadius = "100px",
  padding = "8px 24px",
  btnColor = "#302d38",
  onClick = () => {},
  children,
  ...props
}) => {
  return (
    <ArtButtonBase
      padding={borderWidth}
      borderRadius={borderRadius}
      onClick={onClick}
      btnColor={btnColor}
      {...props}
    >
      <Box
        width={"100%"}
        height={"100%"}
        borderRadius={borderRadius}
        padding={padding}
        whiteSpace={"nowrap"}
      >
        {children}
      </Box>
    </ArtButtonBase>
  );
};

const ArtButtonBase = styled(Box)<ArtButtonProps>`
  box-shadow: -5px -3px 10px 0px #fff2, 5px 3px 10px 0px #0006;
  cursor: pointer;
  & > div {
    background: ${(p) => `${p.btnColor}33`};
    box-shadow: 3px 3px 10px 0px ${(p) => `${p.btnColor}88`} inset,
      -6px -6px 10px 0px ${(p) => `${p.btnColor}88`} inset,
      -3px -3px 10px 0px ${(p) => `${p.btnColor}88`} inset;
  }
  &:hover {
    & > div {
      color: white;
      text-shadow: 0px 0px 20px #fff8;
    }
  }
  &:active {
    & > div {
      box-shadow: 10px 10px 10px 0px ${(p) => `${p.btnColor}22`} inset,
        5px 5px 10px 0px ${(p) => `${p.btnColor}22`} inset;
      text-shadow: none;
    }
  }
`;

export const NormalBtn = styled(Link)``;
NormalBtn.defaultProps = {
  alignItems: "center",
  gridGap: "4px",
  ml: "auto",
  padding: "8px 16px",
  background: "#302d38",
  p: "8px 16px",
  border: "1px solid #34383b",
  borderRadius: "8px",
  cursor: "pointer",
};
