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
import { MinusIcon, PlusIcon, SearchIcon } from "../components/icons";
import { SwipeBtn } from "components/elements/buttons";
import { useWalletHook } from "../common/hooks/wallet";
import { FEE_DECIMAL, MODULE_ADDR, DECIMAL, NODE_URL } from "../config";

export const IndexAllocationModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  allocationData,
  setAllocationData = () => {},
  poolInfo = {},
  ...props
}) => {
  const [showPrice, setShowPrice] = useState(false);
  const { walletConnected, signAndSubmitTransaction } = useWalletHook();

  const updatePool = async () => {
    if (!walletConnected) return;

    if(poolInfo.poolName) {
      let pool_name = poolInfo.poolName.trim();
      let rebalancing_period = poolInfo.settings.rebalancing_period * 1;
      let minimum_contribution = poolInfo.settings.minimum_contribution;
      let minimum_withdrawal_period =
        poolInfo.settings.minimum_withdrawal_period * 1;
      let referral_reward = poolInfo.settings.referral_reward;
      let privacy_allocation = poolInfo.settings.privacy_allocation;

      let index_allocation_key: string[] = [];
      let index_allocation_value: number[] = [];
      let sum = 0;
      allocationData.forEach((data: any) => {
        index_allocation_key.push(data.name);
        index_allocation_value.push(data.value);
        sum += data.value;
      });
      if (sum !== 100) return;

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
      <Flex height={"49px"} gridGap={"8px"}>
        <Flex
          ml={"auto"}
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
          Cancel
        </Flex>
        {!showPrice ? (
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
              setShowPrice(true);
            }}
            zIndex={"0"}
          >
            <PlusIcon size={"18px"} />
            Add new Allocation
          </Flex>
        ) : (
          <SwipeBtn
            onClick={() => {
              allocationData.push({ name: "", value: 0 });
              setAllocationData([...allocationData]);
            }}
          >
            $0.45
          </SwipeBtn>
        )}
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
          updatePool();
        }}
        zIndex={"0"}
      >
        Save
      </Flex>
    </Flex>
  );
};
