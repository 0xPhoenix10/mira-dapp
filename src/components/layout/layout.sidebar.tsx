import { Box } from "components/base";
import { Flex } from "components/base/container";
import {
  AboutIcon,
  DiscordIcon,
  DocsIcon,
  GuideIcon,
  MenuIcon,
  TelegramIcon,
  WhitePaperIcon,
} from "components/icons";
import { useState } from "react";
import styled from "styled-components";

const LayoutSidebar = () => {
  const [visibleSidebar, setVisibleSidebar] = useState(true);
  return (
    <Flex
      col
      spaceBetween
      p={"20px"}
      minWidth={visibleSidebar ? "280px" : "0px"}
      borderRight={"1px solid #1e2022"}
      transition={"200ms"}
    >
      <Flex width={"100%"}>
        <Flex
          maxWidth={visibleSidebar ? "400px" : "0px"}
          flex={"1"}
          col
          alignCenter
          rowGap={"10px"}
          overflow={"hidden"}
          transition={"200ms"}
        >
          <SideBarBtn active icon={<AboutIcon />} title={"About"} />
          <Box background={"#1e2022"} width={"80%"} height={"1px"} />
          <SideBarBtn icon={<GuideIcon />} title={"Guide"} />
          <Box background={"#1e2022"} width={"80%"} height={"1px"} />
          <SideBarBtn icon={<DocsIcon />} title={"Docs"} />
          <Box background={"#1e2022"} width={"80%"} height={"1px"} />
          <SideBarBtn icon={<WhitePaperIcon />} title={"WhitePaper"} />
        </Flex>
        <Flex>
          <Flex
            mb={"auto"}
            bg={"#0003"}
            p={"4px 8px"}
            fontSize={"20px"}
            border={"1px solid #1e2022"}
            borderRadius={"4px"}
            cursor={"pointer"}
            onClick={() => {
              setVisibleSidebar(!visibleSidebar);
            }}
          >
            <MenuIcon />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        justifyCenter
        maxWidth={visibleSidebar ? "400px" : "0px"}
        py={"10px"}
        gridGap={"50px"}
        fontSize={"20px"}
        overflow={"hidden"}
        transition={"200ms"}
      >
        <Flex cursor={"pointer"}>
          <DiscordIcon />
        </Flex>
        <Flex cursor={"pointer"}>
          <TelegramIcon />
        </Flex>
      </Flex>
    </Flex>
  );
};

const SideBarBtnBase = styled(Box)`
  cursor: pointer;
  &:hover * {
    opacity: 1;
  }
`;
SideBarBtnBase.defaultProps = {
  width: "100%",
  padding: "20px",
};
interface SideBarBtnProps {
  icon?: any;
  title?: any;
  onClick?: any;
  active?: boolean;
}
const SideBarBtn: React.FC<SideBarBtnProps> = ({
  icon = "",
  title = "",
  onClick = () => {},
  active,
}) => {
  return (
    <SideBarBtnBase onClick={onClick}>
      <Flex
        alignCenter
        gridGap={"8px"}
        color={active ? "#74bd7b" : "#fff"}
        opacity={active ? "1" : "0.5"}
      >
        <Flex fontSize={"20px"}>{icon}</Flex>
        <Flex fontSize={"16px"}>{title}</Flex>
      </Flex>
    </SideBarBtnBase>
  );
};

export default LayoutSidebar;
