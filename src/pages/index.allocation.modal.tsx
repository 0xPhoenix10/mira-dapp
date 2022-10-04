import React from "react";
import { Flex } from "../components/base/container";
import {
  Box,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../components/base";
import { MinusIcon, PlusIcon, SearchIcon } from "../components/icons";

export const IndexAllocationModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  allocationData,
  setAllocationData = () => {},
  ...props
}) => {
  return (
    <Flex col gridGap={"10px"}>
      <Flex
        alignCenter
        gridGap={"16px"}
        py={"8px"}
        fontSize={"18px"}
        fontWeight={"500"}
        borderBottom={"1px solid #34383b"}
      >
        Index Allocation
        <Flex
          alignCenter
          gridGap={"4px"}
          ml={"auto"}
          background={"#0005"}
          p={"8px 16px"}
          border={"1px solid #34383b"}
          borderRadius={"8px"}
        >
          <Input
            border={"none"}
            background={"transparent"}
            color={"white"}
            placeholder={"Search"}
          />
          <SearchIcon />
        </Flex>
      </Flex>
      <Flex
        gridGap={"16px"}
        background={"#101012"}
        p={"20px"}
        border={"1px solid #34383b"}
        borderRadius={"10px"}
        height={"300px"}
        overflow={"auto"}
      >
        <Table width={"100%"} textAlign={"left"}>
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
              <Th>YTD %</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {allocationData.map((allocData: any, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Flex
                      cursor={"pointer"}
                      onClick={() => {
                        allocationData.splice(index, 1);
                        setAllocationData([...allocationData]);
                      }}
                    >
                      <MinusIcon />
                    </Flex>
                  </Td>
                  <Td>
                    <Flex alignCenter gridGap={"10px"}>
                      <Box
                        background={"linear-gradient(90deg,#fceabb,#f8b500)"}
                        borderRadius={"100%"}
                        width={"25px"}
                        height={"25px"}
                      ></Box>
                      <Input
                        border={"1px solid #34383b"}
                        padding={"5px"}
                        background={"transparent"}
                        color={"white"}
                        placeholder={"input here..."}
                        textAlign={"right"}
                        value={allocData.name}
                        onChange={(e) => {
                          allocationData[index].name = e.target.value;
                          setAllocationData([...allocationData]);
                        }}
                      />
                    </Flex>
                  </Td>
                  <Td>20.2%</Td>
                  <Td>
                    <Input
                      border={"1px solid #34383b"}
                      padding={"5px"}
                      background={"transparent"}
                      color={"white"}
                      placeholder={"input here..."}
                      textAlign={"right"}
                      value={allocData.value}
                      type={"number"}
                      onChange={(e) => {
                        allocationData[index].value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        setAllocationData([...allocationData]);
                      }}
                    />
                    %
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
      <Flex
        justifyCenter
        alignCenter
        gridGap={"8px"}
        background={"#0005"}
        p={"8px 16px"}
        border={"1px solid #34383b"}
        borderRadius={"8px"}
        cursor="pointer"
        onClick={() => {
          allocationData.push({ name: "", value: 0 });
          setAllocationData([...allocationData]);
        }}
        zIndex={"0"}
      >
        <PlusIcon size={"18px"} />
        Add new Allocation
      </Flex>
      <Flex
        justifyCenter
        alignCenter
        gridGap={"8px"}
        background={"#0005"}
        p={"8px 16px"}
        border={"1px solid #34383b"}
        borderRadius={"8px"}
        cursor="pointer"
        onClick={() => {
          setVisible(false);
        }}
        zIndex={"0"}
      >
        Save
      </Flex>
    </Flex>
  );
};
