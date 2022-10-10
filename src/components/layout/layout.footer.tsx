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
  CoinIcon,
} from "components/icons";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const LayoutFooter = () => {
  const location = useLocation();
  const navigate = useNavigate()
  return (
    <Flex
      background={"#222129"}
      justifyCenter
      p={"15px"}
      pb={"0px"}
      borderTop={"1px solid #333334"}
    >
      <Flex gridGap={"25px"}>
        <FooterBtn active={location.pathname === "/"} title={"Our Tokens"} icon={<CoinIcon />} onClick={() => navigate("/")} />
        <FooterBtn active={location.pathname === "/dashboard"} title={"Invest & Manage"} icon={<ManageIcon />} onClick={() => navigate("/dashboard")} />
        {/* <FooterBtn active={location.pathname === "/121212"} title={"Token"} icon={<StakeIcon />} onClick={() => navigate("/121212")} /> */}
        <FooterBtn active={location.pathname === "/121212"} title={"Stake"} icon={<StakeIcon />} onClick={() => navigate("/121212")} />
        <FooterBtn active={location.pathname === "/121212"} title={"Swap"} icon={<SwapIcon />} onClick={() => navigate("/121212")} />
        {/* <FooterBtn active={location.pathname === "/121212"} title={"Mine"} icon={<MineIcon />} onClick={() => navigate("/121212")} /> */}
        {/* <FooterBtn active={location.pathname === "/121212"} title={"Liquidity Farm"} icon={<FarmIcon />} onClick={() => navigate("/121212")} /> */}
        <FooterBtn active={location.pathname === "/121212"} title={"Launchpad"} icon={<LaunchpadIcon />} onClick={() => navigate("/121212")} />
        <FooterBtn active={location.pathname === "/121212"} title={"Explorer"} icon={<ExplorerIcon />} onClick={() => navigate("/121212")} />
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
  fontFamily: "art",
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
  onClick = () => { },
  active,
}) => {
  return (
    <FooterBtnBase
      background={active ? "linear-gradient(#74BD7B, #70cee6)" : "none"}
      boxShadow={`${active ? `0px 0px 7px 0px black, ` : ``
        }-5px -3px 10px 0px #fff1, -5px 5px 10px 0px #fff1, 5px 3px 10px 0px #0006`}
      borderRadius={"10px 10px 0px 0px"}
      border={active ? "2px solid white" : "0px"}
      borderBottom={"none"}
      color={active ? "#27282c" : "#fff8"}
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
