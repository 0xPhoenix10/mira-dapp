import React, { ReactComponentElement, useEffect, useState } from "react";
import { Box } from "components/base";
import { Flex } from "components/base/container";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

interface IItem {
  id: string,
  content: React.ReactElement,
}

const LayoutFooter = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const [items, setItems] = useState<IItem[]>([
    {
      id: 'our_tokens',
      content: <FooterBtn active={location.pathname === "/"} title={"Our Tokens"} icon={<CoinIcon />} onClick={() => navigate("/")} />
    },
    {
      id: 'invest_manage',
      content: <FooterBtn active={location.pathname === "/dashboard"} title={"Invest & Manage"} icon={<ManageIcon />} onClick={() => navigate("/dashboard")} />
    },
    {
      id: 'stake',
      content: <FooterBtn active={location.pathname === "/121212"} title={"Stake"} icon={<StakeIcon />} onClick={() => navigate("/121212")} />
    },
    {
      id: 'swap',
      content: <FooterBtn active={location.pathname === "/121212"} title={"Swap"} icon={<SwapIcon />} onClick={() => navigate("/121212")} />
    },
    {
      id: 'launchpad',
      content: <FooterBtn active={location.pathname === "/121212"} title={"Launchpad"} icon={<LaunchpadIcon />} onClick={() => navigate("/121212")} />
    },
    {
      id: 'explorer',
      content: <FooterBtn active={location.pathname === "/121212"} title={"Explorer"} icon={<ExplorerIcon />} onClick={() => navigate("/121212")} />
    },
  ]);

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result:IItem[] = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? 'lightblue' : 'inherit',
    display: 'flex',
    // padding: grid,
    overflow: 'auto',
  });
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // padding: grid * 2,
    paddingTop: '5px',
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

    setItems(newItems)
  }
  return (
    <Flex
      background={"#222129"}
      justifyCenter
      p={"15px"}
      pb={"0px"}
      borderTop={"1px solid #333334"}
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
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
      
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
