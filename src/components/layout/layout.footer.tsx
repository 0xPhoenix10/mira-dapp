import { Box } from "components/base";
import { Flex } from "components/base/container";
import {
  ManageIcon,
  MineIcon,
  StakeIcon,
  SwapIcon,
  FarmIcon,
  LaunchpadIcon,
  ExplorerIcon,
} from "components/icons";
import styled from "styled-components";

const LayoutFooter = () => {
  return (
    <Flex justifyCenter p={"15px"} pb={"0px"} borderTop={"1px solid #1e2022"}>
      <Flex gridGap={"20px"}>
        <FooterBtn active title={"Invest & Manage"} icon={<ManageIcon />} />
        <Box bg={"#1e2022"} width={"1px"} height={"calc(100% - 10px)"} />
        <FooterBtn title={"Stake"} icon={<StakeIcon />} />
        <Box bg={"#1e2022"} width={"1px"} height={"calc(100% - 10px)"} />
        <FooterBtn title={"Swap"} icon={<SwapIcon />} />
        <Box bg={"#1e2022"} width={"1px"} height={"calc(100% - 10px)"} />
        <FooterBtn title={"Mine"} icon={<MineIcon />} />
        <Box bg={"#1e2022"} width={"1px"} height={"calc(100% - 10px)"} />
        <FooterBtn title={"Liquidity Farm"} icon={<FarmIcon />} />
        <Box bg={"#1e2022"} width={"1px"} height={"calc(100% - 10px)"} />
        <FooterBtn title={"Launchpad"} icon={<LaunchpadIcon />} />
        <Box bg={"#1e2022"} width={"1px"} height={"calc(100% - 10px)"} />
        <FooterBtn title={"Explorer"} icon={<ExplorerIcon />} />
      </Flex>
    </Flex>
  );
};
const FooterBtnBase = styled(Box)`
  &:hover {
    color: white;
  }
`;
FooterBtnBase.defaultProps = {
  p: "14px 28px",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "100ms",
};
interface FooterBtnProps {
  icon?: any;
  title?: any;
  onClick?: any;
  active?: boolean;
}
const FooterBtn: React.FC<FooterBtnProps> = ({
  icon = "",
  title = "",
  onClick = () => {},
  active,
}) => {
  return (
    <FooterBtnBase
      background={active ? "linear-gradient(#298a63, #70cee6)" : "none"}
      boxShadow={`${
        active ? `0px 0px 7px 0px black, ` : ``
      }-5px -3px 10px 0px #fff1, -5px 5px 10px 0px #fff1, 5px 3px 10px 0px #0006`}
      borderRadius={"10px 10px 0px 0px"}
      border={active ? "3px solid #0d3d3b" : "0px"}
      borderBottom={"none"}
      color={active ? "#000000" : "#fff8"}
      onClick={onClick}
    >
      <Flex alignCenter gridGap={"8px"}>
        <Flex fontSize={"20px"}>{icon}</Flex>
        <Flex fontSize={"16px"}>{title}</Flex>
      </Flex>
    </FooterBtnBase>
  );
};

export default LayoutFooter;
