import React, { useState } from "react";
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
import { CustomSelect, SmOption } from "components/form";
import { MinusIcon, PlusIcon, SearchIcon } from "../components/icons";
import { SwipeBtn } from "components/elements/buttons";
import { useWalletHook } from "../common/hooks/wallet";
import { FEE_DECIMAL, MODULE_ADDR, DECIMAL, NODE_URL } from "../config";

import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";

const CustomSelectInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  color: "#fff",
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    position: "relative",
    border: "1px solid #34383b",
    fontSize: 14,
    padding: "1px 26px",
    fontFamily: ["art"].join(","),
  },
  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
}));
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#8888",
  },
}));

export const IndexAllocationModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  allocationData,
  setAllocationData = () => {},
  poolInfo = {},
  ...props
}) => {
  const { walletConnected, signAndSubmitTransaction } = useWalletHook();

  const updatePool = async () => {
    if (!walletConnected) return;

    let sum = 0;
    let index_allocation_key: string[] = [];
    let index_allocation_value: number[] = [];
    for (let i = 0; i < allocationData.length; i++) {
      if (allocationData[i].value == 0) {
        return;
      }
      index_allocation_key.push(allocationData[i].name);
      index_allocation_value.push(allocationData[i].value);
      sum += allocationData[i].value;
    }
    if (sum !== 100) return;

    if (poolInfo.poolName) {
      let pool_name = poolInfo.poolName.trim();
      let rebalancing_period = poolInfo.settings.rebalancing_period * 1;
      let minimum_contribution = poolInfo.settings.minimum_contribution;
      let minimum_withdrawal_period =
        poolInfo.settings.minimum_withdrawal_period * 1;
      let referral_reward = poolInfo.settings.referral_reward;
      let privacy_allocation = poolInfo.settings.privacy_allocation;

      const transaction = {
        type: "entry_function_payload",
        function: `${MODULE_ADDR}::mira::update_pool`,
        arguments: [
          pool_name,
          rebalancing_period,
          minimum_contribution,
          minimum_withdrawal_period,
          referral_reward,
          index_allocation_key,
          index_allocation_value,
          privacy_allocation,
        ],
        type_arguments: [],
      };
      const result = await signAndSubmitTransaction(transaction);

      if (result) {
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
  };
  const arrCoins = [
    "APT",
    "USDT",
    "USDC",
    "BTC",
    "SOL",
    "AVAX",
    "DOT",
    "ETH",
    "MATIC",
    "UNI",
  ];
  const getDefaultAddValue = () => {
    for (let i = 0; i < arrCoins.length; i++) {
      const isExist = allocationData.some((item) => arrCoins[i] === item.name);
      if (!isExist) {
        return arrCoins[i];
      }
    }
    return "";
  };

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
        background={"#302d38"}
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
                      <Flex><Box
                        background={"linear-gradient(90deg,#fceabb,#f8b500)"}
                        borderRadius={"100%"}
                        width={"25px"}
                        height={"25px"}
                      /></Flex>
                      <Select
                        value={allocationData[index].name}
                        onChange={(e) => {
                          const isExist = allocationData.some(
                            (item) => e.target.value === item.name
                          );
                          if (isExist) {
                            return;
                          }
                          allocationData[index].name = e.target.value;
                          setAllocationData([...allocationData]);
                        }}
                        input={<CustomSelectInput />}
                        inputProps={{
                          MenuProps: {
                            sx: {
                              "& .MuiPaper-root": {
                                backgroundColor: "transparent",
                              },
                            },
                            MenuListProps: {
                              sx: {
                                backgroundColor: "transparent",
                                boxShadow: "1px 1px 10px -4px black",
                                backdropFilter: "blur(10px)",
                                borderRadius: "8px",
                                color: "#fff",
                              },
                            },
                          },
                        }}
                      >
                        {arrCoins.map((coin, skey) => {
                          return (
                            <CustomMenuItem value={coin} key={skey} sx={{
                              display: coin == allocationData[index].name ? "none" : "flex"
                            }}>
                              {coin}
                            </CustomMenuItem>
                          );
                        })}
                      </Select>
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
          const defaultName = getDefaultAddValue();
          if (defaultName == "") {
            return;
          }
          allocationData.push({ name: defaultName, value: 1 });
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
          updatePool();
        }}
        zIndex={"0"}
      >
        Save
      </Flex>
    </Flex>
  );
};
