import { Box, Input } from "components/base";
import { Flex } from "components/base/container";
import { IconNarrow } from "components/icons";
import { Children, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface CustomSelectSelectProps {
  onChange?: any;
  bg?: any;
  width?: any;
  after?: any;
  before?: any;
  placeHolder?: string;
  value?: any;
  [index: string]: any;
}

export const CustomSelect: React.FC<CustomSelectSelectProps> = ({
  after,
  before,
  onChange,
  bg,
  width,
  children,
  placeHolder,
  value,
  ...props
}) => {
  const [currentOption, setCurrentOption] = useState<any>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [optionList, setOptionList] = useState<any>(null);
  const dropBox = useRef<any>();
  const dropPannel = useRef<any>();
  useEffect(() => {
    if (!optionList) return;
    for (let i = 0; i < optionList.length; i++) {
      const each = optionList[i];
      if (each?.value === value) {
        setCurrentOption(each);
      }
    }
  }, [value]);
  useEffect(() => {
    const handle = (event: any) => {
      if (dropBox?.current && !dropBox.current.contains(event.target)) {
        setIsOpened(false);
      }
    };
    window.addEventListener("click", handle);
    return () => {
      window.removeEventListener("click", handle);
    };
  }, []);
  useEffect(() => {
    const list: any = [];
    if (!children) {
      setOptionList(list);
      return;
    } else {
      Children.toArray(children)?.map((each: any) => {
        if (each.props.customTagType !== "--411customisedOption--") {
          return null;
        }
        const eachValue = each.props.value;
        const text = each.props.children;
        const selected = each.props.selected;
        list.push({
          value: eachValue,
          text: text,
          selected: !currentOption && selected,
        });
      });
      list.map((each: any, index: any) => {
        if (each.value === value) setCurrentOption(each);
        else if (each.selected) setCurrentOption(each);
      });
      setOptionList(list);
    }
  }, [children]);
  return (
    <Box position={"relative"} ref={dropBox} {...props}>
      <Box
        px={"18px"}
        py={"12px"}
        height={"100%"}
        whiteSpace={"nowrap"}
        fontWeight={"400"}
        fontSize={"14px"}
        lineHeight={"1em"}
        color={"white"}
        cursor="pointer"
        display={"flex"}
        alignItems={"center"}
        flexWrap={"nowrap"}
        gridGap={"8px"}
        onClick={() => {
          setIsOpened(!isOpened);
        }}
      >
        {before}
        {currentOption ? currentOption.text : placeHolder || "select ..."}
        <Box
          ml={"auto"}
          fontSize={"1em"}
          color={"white"}
          display={"flex"}
          alignItems={"center"}
        >
          <IconNarrow dir={isOpened ? "up" : "down"} />
        </Box>
        {after}
      </Box>
      <Box
        visibility={isOpened ? "visible" : "hidden"}
        opacity={isOpened ? "1" : "0"}
        position={"absolute"}
        top={"105%"}
        left={"0px"}
        minWidth={"100%"}
        bg={"normal"}
        backdropFilter={"blur(10px)"}
        borderRadius={"8px"}
        ref={dropPannel}
        display={"flex"}
        flexDirection={"column"}
        transition={"var(--transition)"}
        boxShadow={"1px 1px 10px -4px black"}
        overflow={"hidden"}
        zIndex={isOpened ? "1000" : "-1000"}
      >
        {optionList
          ? optionList.map((each: any, index: any) => {
              return (
                <SmOption
                  key={index}
                  onClick={() => {
                    setIsOpened(false);
                    if (currentOption?.value === each.value) return;
                    setCurrentOption(each);
                    onChange && onChange(each.value);
                  }}
                >
                  {each.text}
                </SmOption>
              );
            })
          : "Here is not any options."}
      </Box>
    </Box>
  );
};

interface SmOptionProps {
  value: any;
  [index: string]: any;
}
export const SmOption = styled(Box)<SmOptionProps>`
  white-space: nowrap;
  display: flex;
  align-items: center;
  grid-gap: 8px;
  cursor: pointer;
  &:hover {
    background: #8888;
  }
`;
SmOption.defaultProps = {
  customTagType: "--411customisedOption--",
  px: "16px",
  py: "8px",
};

interface RadioBtnProps {
  onChange?: any;
  value?: string;
  title?: string;
  name?: string;
  selected?: boolean;
}
export const RadioBtn: React.FC<RadioBtnProps> = ({
  onChange,
  value = "value",
  name = "name",
  title = "title",
  selected,
}) => {
  const id = (Math.random() + Math.random()).toString();
  return (
    <RadioBtnBase>
      <Input
        type="radio"
        display={"none"}
        id={id}
        value={value}
        name={name}
        defaultChecked={selected}
        onClick={(e) => {
          onChange && onChange(value);
        }}
      />
      <label htmlFor={id}>
        <div></div>
        {title}
      </label>
    </RadioBtnBase>
  );
};
const RadioBtnBase = styled(Flex)`
  & > label {
    display: flex;
    align-items: center;
    grid-gap: 4px;
  }
  & > label > div {
    background: #0d3d3b;
    width: 16px;
    aspect-ratio: 1;
    border-width: 8px;
    border-style: solid;
    border-color: white;
    border-radius: 100px;
    box-sizing: border-box;
  }
  & > input[type="radio"]:checked + label > div {
    border-width: 2px;
  }
`;
RadioBtnBase.defaultProps = {
  alignCenter: true,
};
