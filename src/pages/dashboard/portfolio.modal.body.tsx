import React, { useEffect, useState } from "react";
import { Flex } from "../../components/base/container";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Table, Tbody, Td, Tr } from "../../components/base";
import { ArrowIcon } from "components/icons";
import DepositModalBody from "./deposit.modal.body";
import WithdrawModalBody from "./withdraw.modal.body";
import { useWalletHook } from "../../common/hooks/wallet";
import {
  FriendStatus,
  getFriendData,
  requestFriend,
} from "../../utils/graphql";

export const PortfolioModalBody: React.FC<{ [index: string]: any }> = ({
  miraIndexInfo = {},
  ...props
}) => {
  const { walletConnected, walletAddress } = useWalletHook();
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);

  const [isFriend, setIsFriend] = useState(false);
  useEffect(() => {
    if (walletConnected) {
      const getFetchFriend = async () => {
        let friendDataList = await getFriendData(walletAddress);
        for (let i = 0; i < friendDataList.length; i++) {
          if (
            friendDataList[i].receiveUser === miraIndexInfo.poolOwner &&
            friendDataList[i].status !== FriendStatus.None
          ) {
            setIsFriend(true);
            return;
          }
        }
      };

      getFetchFriend();
    }
  }, [walletConnected, miraIndexInfo.poolOwner, walletAddress]);
  const data = [
    { name: "APT", value: 400 },
    { name: "ETH", value: 300 },
    { name: "BTC", value: 300 },
    { name: "DOT", value: 200 },
  ];
  const COLORS = [
    "#97acd0",
    "#5c87bf",
    "#4a7ab2",
    "#4470a5",
    "#3d6595",
    "#345882",
  ];

  // ["#d3dae9", "#c9d3e4", "#bdc9df", "#b2c1db", "#97acd0", "#87a2cb", "#7696c6", "#5c87bf", "#4d7fba",
  //   "#4a7ab2", "#4775ac", "#4470a5", "#406a9d", "#3d6595", "#395f8d", "#345882", "#2f5078"];

  const request_friend = async () => {
    if (!walletConnected) return;
    let res = await requestFriend(walletAddress, miraIndexInfo.poolOwner);
    if (res) {
      setIsFriend(true);
    }
  };
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.45;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        fontSize={"10px"}
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {/* {`${(percent * 100).toFixed(0)}%`} */}
        {`${data[index].name}`}
      </text>
    );
  };
  return (
    <>
      {visibleDeposit || visibleWithdraw ? (
        <>
          <Flex
            background={"#0005"}
            p={"8px 16px"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            ml={"auto"}
            cursor="pointer"
            onClick={() => {
              setVisibleDeposit(false);
              setVisibleWithdraw(false);
            }}
            zIndex={"0"}
          >
            <ArrowIcon dir={"left"} />
          </Flex>
          {visibleDeposit && <DepositModalBody />}
          {visibleWithdraw && <WithdrawModalBody />}
        </>
      ) : (
        <Flex col gridGap={"10px"}>
          <Flex
            py={"8px"}
            fontSize={"18px"}
            fontWeight={"500"}
            borderBottom={"1px solid #34383b"}
          >
            Portfolio
          </Flex>
          <Flex justifyCenter gridGap={"16px"}>
            <Flex
              col
              background={"#302D38"}
              p={"20px"}
              border={"1px solid #34383b"}
              borderRadius={"20px"}
              gridGap={"12px"}
              {...props}
            >
              <Flex justifyCenter alignCenter gridGap={"16px"}>
                <Flex col>
                  <Flex width={"150px"} aspectRatio={"1"}>
                    <ResponsiveContainer>
                      <PieChart width={300} height={300}>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={"100%"}
                          fill="#8884d8"
                          stroke={"transparent"}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Flex>
                  <Flex justifyCenter gridGap={"8px"}>
                    <Flex
                      alignCenter
                      gridGap={"4px"}
                      padding={"8px 16px"}
                      background={"#0002"}
                      p={"8px 16px"}
                      border={"1px solid #34383b"}
                      borderRadius={"8px"}
                      cursor="pointer"
                      onClick={() => {
                        setVisibleDeposit(true);
                      }}
                    >
                      Invest
                    </Flex>
                    <Flex
                      alignCenter
                      gridGap={"4px"}
                      padding={"8px 16px"}
                      background={"#0002"}
                      p={"8px 16px"}
                      border={"1px solid #34383b"}
                      borderRadius={"8px"}
                      cursor="pointer"
                      onClick={() => {
                        setVisibleWithdraw(true);
                      }}
                    >
                      Withdraw
                    </Flex>
                  </Flex>
                </Flex>
                <Flex col gridGap={"4px"}>
                  <Flex col gridGap={"10px"}>
                    <Flex col justifyCenter gridGap={"16px"}>
                      <Table cellSpacing={"2px"}>
                        <Tbody>
                          <Tr>
                            <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                              Pool Name:
                            </Td>
                            <Td
                              px={"4px"}
                              py={"8px"}
                              borderBottom={"none"}
                              color={"#888"}
                            >
                              {miraIndexInfo.poolName}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                              Pool owner:
                            </Td>
                            <Td
                              px={"4px"}
                              py={"8px"}
                              borderBottom={"none"}
                              color={"#888"}
                            >
                              <Flex justifyCenter alignCenter gridGap={"8px"}>
                                {miraIndexInfo.poolOwner}
                                {walletConnected &&
                                  miraIndexInfo.poolOwner !== walletAddress &&
                                  !isFriend && (
                                    <Flex
                                      alignCenter
                                      gridGap={"4px"}
                                      padding={"8px 16px"}
                                      background={"#0005"}
                                      p={"8px 16px"}
                                      border={"1px solid #34383b"}
                                      borderRadius={"8px"}
                                      cursor="pointer"
                                      onClick={() => request_friend()}
                                    >
                                      Request friend
                                    </Flex>
                                  )}
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                              Pool address:
                            </Td>
                            <Td
                              px={"4px"}
                              py={"8px"}
                              borderBottom={"none"}
                              color={"#888"}
                            >
                              {miraIndexInfo.poolAddress}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                              Management Fee:
                            </Td>
                            <Td
                              px={"4px"}
                              py={"8px"}
                              borderBottom={"none"}
                              color={"#888"}
                            >
                              {miraIndexInfo.managementFee} %
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"8px"} borderBottom={"none"}>
                              Founded:
                            </Td>
                            <Td
                              px={"4px"}
                              py={"8px"}
                              borderBottom={"none"}
                              color={"#888"}
                            >
                              {miraIndexInfo.founded}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};
