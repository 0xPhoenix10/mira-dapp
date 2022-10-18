/* eslint-disable */
import React, { ReactComponentElement, useEffect, useState } from "react";
import { Box } from "components/base";
import { Flex } from "components/base/container";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FrontContext } from "providers/provider.front";
import { useContext } from "react";

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
import styledComponents from "styled-components";

import { styled, alpha } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { CustomTooltip } from "components/elements/tooptip";
import { BsInfoCircle } from "react-icons/bs";

interface IItem {
  id: string;
  link: string;
  title: string;
  icon: string;
}

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  background: "none",
  boxShadow:
    "-5px -3px 10px 0px #fff1, -5px 5px 10px 0px #fff1, 5px 3px 10px 0px #0006",
  borderRadius: "10px 10px 0px 0px",
  border: "0px",
  color: "#fff8",

  "&:hover": {
    background: "none",
    boxShadow:
      "-5px -3px 10px 0px #fff1, -5px 5px 10px 0px #fff1, 5px 3px 10px 0px #0006",
    color: "#fff",
  },
}));
const CollapeButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: "0px",
  color: "#fff8",
  background: "none",

  "&:hover": {
    background: "none",
    color: "#fff",
  },
}));
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const defaultMenuList = {
  APTOS: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
    {
      id: "invest_manage",
      link: "/invest",
      title: "Invest & Manage",
      icon: "ManageIcon",
    },
    { id: "stake", link: "/stake", title: "Stake", icon: "StakeIcon" },
    { id: "swap", link: "/swap", title: "Swap", icon: "SwapIcon" },
    {
      id: "launchpad",
      link: "/launchpad",
      title: "Launchpad",
      icon: "LaunchpadIcon",
    },
    {
      id: "explorer",
      link: "/explorer",
      title: "Explorer",
      icon: "ExplorerIcon",
    },
  ],
  SUI: [{ id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" }],
  SOLANA: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
    {
      id: "step_finance",
      link: "https://www.step.finance/",
      title: "Step Finance",
      icon: "ManageIcon",
    },
    { id: "stake", link: "/stake", title: "Stake", icon: "StakeIcon" },
    {
      id: "solster_finance",
      link: "/invest",
      title: "Solster Finance",
      icon: "SwapIcon",
    },
    {
      id: "solster_finance1",
      link: "/invest",
      title: "Solster Finance",
      icon: "SwapIcon",
    },
    {
      id: "explorer",
      link: "/explorer",
      title: "SolanaFM",
      icon: "ExplorerIcon",
    },
  ],
  AVALANCHE: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
  ETHEREUM: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
  POLYGON: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
  FANTOM: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
  OPTIMISM: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
  AURORA: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
  COSMOS: [
    { id: "our_tokens", link: "/", title: "Mira Funds", icon: "CoinIcon" },
  ],
};

const defaultMoreMenuList = {
  APTOS: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  SUI: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  SOLANA: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  AVALANCHE: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  ETHEREUM: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  POLYGON: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  FANTOM: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  OPTIMISM: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  AURORA: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
  COSMOS: [
    { id: "mine", link: "/mine", title: "Mine", icon: "MineIcon" },
    { id: "farm", link: "/farm", title: "Liquidity Farm", icon: "FarmIcon" },
  ],
};
const defaultRemoveMenuList = {
  APTOS: [
    { id: "stake", link: "/stake", title: "Stake", icon: "StakeIcon" },
    { id: "swap", link: "/swap", title: "Swap", icon: "SwapIcon" },
    {
      id: "launchpad",
      link: "/launchpad",
      title: "Launchpad",
      icon: "LaunchpadIcon",
    },
    {
      id: "explorer",
      link: "/explorer",
      title: "Explorer",
      icon: "ExplorerIcon",
    },
  ],
  SUI: [],
  SOLANA: [
    { id: "stake", link: "/stake", title: "Stake", icon: "StakeIcon" },
    {
      id: "solster_finance",
      link: "/invest",
      title: "Solster Finance",
      icon: "SwapIcon",
    },
    {
      id: "solster_finance1",
      link: "/invest",
      title: "Solster Finance",
      icon: "SwapIcon",
    },
    {
      id: "explorer",
      link: "/explorer",
      title: "SolanaFM",
      icon: "ExplorerIcon",
    },
  ],
  AVALANCHE: [],
  ETHEREUM: [],
  POLYGON: [],
  FANTOM: [],
  OPTIMISM: [],
  AURORA: [],
  COSMOS: [],
};

const LayoutFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapse, setCollapse] = useState(false);
  const [items, setItems] = useState<IItem[]>([]);
  const [moreItems, setMoreItems] = useState<IItem[]>([]);
  const [removeItems, setRemoveItems] = useState<IItem[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMoreMenu = Boolean(anchorEl);
  const { currentChain } = useContext(FrontContext);

  useEffect(() => {
    console.log("currentChain", currentChain);
    setItems([]);
  }, [currentChain]);

  useEffect(() => {
    var menuList = JSON.parse(localStorage.getItem(`${currentChain}_menuList`));
    if (items.length == 0) {
      var moreMenuList = JSON.parse(
        localStorage.getItem(`${currentChain}_moreMenuList`)
      );
      var removeMenuList = JSON.parse(
        localStorage.getItem(`${currentChain}_removeMenuList`)
      );
      if (menuList && menuList.length > 0) {
        setItems(menuList);
      } else {
        setItems(defaultMenuList[currentChain]);
      }
      if (moreMenuList) {
        setMoreItems(moreMenuList);
      } else {
        setMoreItems(defaultMoreMenuList[currentChain]);
      }
      if (removeMenuList) {
        setRemoveItems(removeMenuList);
      } else {
        setRemoveItems(defaultRemoveMenuList[currentChain]);
      }
    }
  }, [items, moreItems, removeItems]);

  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result: IItem[] = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const getListStyle = (isDraggingOver) => ({
    // background: isDraggingOver ? 'lightblue' : 'inherit',
    display: "flex",
    padding: "0px 15px",
  });
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    paddingTop: "5px",
    // margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    // background: isDragging ? 'lightgreen' : 'inherit',

    // styles we need to apply on draggables
    ...draggableStyle,
  });
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems: IItem[] = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    localStorage.setItem(`${currentChain}_menuList`, JSON.stringify(newItems));
    setItems(newItems);
  };

  const getIconComponent = (iconName: string) => {
    var res = <CoinIcon />;
    switch (iconName) {
      case "CoinIcon":
        res = <CoinIcon />;
        break;
      case "StakeIcon":
        res = <StakeIcon />;
        break;
      case "SwapIcon":
        res = <SwapIcon />;
        break;
      case "LaunchpadIcon":
        res = <LaunchpadIcon />;
        break;
      case "ExplorerIcon":
        res = <ExplorerIcon />;
        break;
      case "MineIcon":
        res = <MineIcon />;
        break;
      case "FarmIcon":
        res = <FarmIcon />;
        break;
    }
    return res;
  };

  const addNewMenu = (index) => {
    if (moreItems[index]["title"] === undefined) {
      return;
    }

    items.push(moreItems[index]);
    localStorage.setItem(`${currentChain}_menuList`, JSON.stringify(items));
    setItems(items);

    if (removeItems.length === 0) {
      var new_array: IItem[] = [];
      new_array.push(moreItems[index]);
      localStorage.setItem(
        `${currentChain}_removeMenuList`,
        JSON.stringify(new_array)
      );
      setRemoveItems(new_array);
    } else {
      removeItems.push(moreItems[index]);
      localStorage.setItem(
        `${currentChain}_removeMenuList`,
        JSON.stringify(removeItems)
      );
      setRemoveItems(removeItems);
    }

    moreItems.splice(index, 1);
    localStorage.setItem(
      `${currentChain}_moreMenuList`,
      JSON.stringify(moreItems)
    );
    setMoreItems(moreItems);

    handleMoreMenuClose();
  };

  const removeMenu = (index) => {
    if (removeItems[index]["title"] === undefined) {
      return;
    }

    var filteredArray = items.filter(
      (element: any) => element.id !== removeItems[index]["id"]
    );
    localStorage.setItem(
      `${currentChain}_menuList`,
      JSON.stringify(filteredArray)
    );
    setItems(filteredArray);

    if (moreItems.length === 0) {
      var new_array: IItem[] = [];
      new_array.push(removeItems[index]);
      localStorage.setItem(
        `${currentChain}_moreMenuList`,
        JSON.stringify(new_array)
      );
      setMoreItems(new_array);
    } else {
      moreItems.push(removeItems[index]);
      localStorage.setItem(
        `${currentChain}_moreMenuList`,
        JSON.stringify(moreItems)
      );
      setMoreItems(moreItems);
    }

    removeItems.splice(index, 1);
    localStorage.setItem(
      `${currentChain}_removeMenuList`,
      JSON.stringify(removeItems)
    );
    setRemoveItems(removeItems);

    handleMoreMenuClose();
  };

  return (
    <>
      <Flex
        background={"#222129"}
        justifyCenter
        p={"15px"}
        pb={"0px"}
        borderTop={"1px solid #333334"}
        overflow={"auto"}
        display={isCollapse ? 'none' : 'flex' }
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <Flex
                gridGap={"25px"}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {
                          <FooterBtn
                            active={location.pathname === item.link}
                            title={item.title}
                            icon={getIconComponent(item.icon)}
                            onClick={() => navigate(item.link)}
                            tooltip="add info popup for each tab in the footer (Mira Funds,...) - I will add the text myself"
                          />
                        }
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Flex>
            )}
          </Droppable>
        </DragDropContext>
        <Flex gridGap={"25px"} pt={"5px"} ml={"10px"}>
          <StyledButton
            id="demo-customized-button"
            aria-controls={openMoreMenu ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMoreMenu ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleMoreMenuClick}
          >
            ...
          </StyledButton>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMoreMenu}
            onClose={handleMoreMenuClose}
          >
            {moreItems.map((item, index) => (
              <MenuItem
                onClick={() => addNewMenu(index)}
                disableRipple
                key={index}
              >
                <AddIcon />
                {item.title}
              </MenuItem>
            ))}
            {removeItems.length !== 0 && (
              <Divider sx={{ my: 0.5 }} textAlign="left">
                Added
              </Divider>
            )}
            {removeItems.length !== 0 &&
              removeItems.map((item, index) => (
                <MenuItem
                  onClick={() => removeMenu(index)}
                  disableRipple
                  key={index}
                >
                  <RemoveIcon />
                  {item.title}
                </MenuItem>
              ))}
          </StyledMenu>
        </Flex>
      </Flex>
      <Flex gridGap={"25px"} pt={"5px"} ml={"10px"} position={"absolute"} right={"0px"} minHeight={"56px"} bottom={"0px"}>
        <CollapeButton
          variant="contained"
          disableElevation
          onClick={()=>{setCollapse(!isCollapse)}}
        >
          {isCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </CollapeButton>
      </Flex>
    </>
  );
};
const FooterBtnBase = styledComponents(Box)`
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
  tooltip?: string;
}
const FooterBtn: React.FC<FooterBtnProps> = ({
  icon = "",
  title = "",
  onClick = () => {},
  active,
  tooltip = "",
}) => {
  return (
    <FooterBtnBase
      background={active ? "linear-gradient(#74BD7B, #70cee6)" : "none"}
      boxShadow={`${
        active ? `0px 0px 7px 0px black, ` : ``
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
        {
          tooltip != "" &&
          <CustomTooltip
            title={tooltip}
            arrow
            disableInteractive
            placement="top"
          >
            <span>ⓘ</span>
          </CustomTooltip>
        }
      </Flex>
    </FooterBtnBase>
  );
};

export default LayoutFooter;
