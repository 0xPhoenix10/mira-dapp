import React, { useEffect, useState } from "react";
import { Flex } from "../../components/base/container";
import { Link, Table, Tbody, Td, Tr, Th, Thead } from "../../components/base";
import DepositModalBody from "./deposit.modal.body";
import WithdrawModalBody from "./withdraw.modal.body";
import { useWalletHook } from "../../common/hooks/wallet";
import {
  FriendStatus,
  getFriendData,
  requestFriend,
} from "../../utils/graphql";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { renderActiveShape } from "../../common/recharts/piechart";
import { CustomSelect, SmOption } from "components/form";
import { ArtButton, NormalBtn } from "components/elements/buttons";
import { ArrowIcon, ExchangeIcon } from "components/icons";

interface IData {
  name: string;
  value: string | number;
}

export const PortfolioModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  setUpdateInvest = () => {},
  miraIndexInfo = {},
  ...props
}) => {
  const { walletConnected, walletAddress } = useWalletHook();
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setHovered] = React.useState(false);

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
  }, [walletConnected, walletAddress]);

  const data = [
    { name: "WORM", value: 350 },
    { name: "PYTH", value: 300 },
    { name: "CLOCK", value: 200 },
    { name: "OTTER", value: 400 },
  ];
  const data2 = [
    {
      name: "9/26",
      uv: 40.0,
      pv: 24.0,
      amt: 24.0,
    },
    {
      name: "9/28",
      uv: 30.0,
      pv: 13.98,
      amt: 22.1,
    },
    {
      name: "9/30",
      uv: 20.0,
      pv: 98.0,
      amt: 22.9,
    },
    {
      name: "10/2",
      uv: 27.8,
      pv: 39.08,
      amt: 20.0,
    },
    {
      name: "10/2",
      uv: 18.9,
      pv: 48.0,
      amt: 2181,
    },
    {
      name: "10/4",
      uv: 23.9,
      pv: 38.0,
      amt: 25.0,
    },
    {
      name: "10/6",
      uv: 34.9,
      pv: 43.0,
      amt: 21.0,
    },
  ];

  const COLORS = [
    "#5a9e47",
    "#23b5b5",
    "#527da7",
    "#d4901c",
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

  const style = {
    backgroundColor: "lightgrey",
    color: "black",
    padding: "2px 15px",
    fontSize: "12px",
  };

  const CustomizedTooltip = React.memo((props: any) => {
    if (props.payload.length > 0) {
      const sum = data.reduce((a, v) => (a = a + v.value), 0);

      const item: IData = props.payload[0];
      return (
        <div style={style}>
          <p>
            {item.name} - {((Number(item.value) / sum) * 100).toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  });

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
    setHovered(true);
  };

  const onPieLeave = () => setHovered(false);

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
          {visibleDeposit && (
            <DepositModalBody
              setVisible={setVisibleDeposit}
              setUpdateInvest={setUpdateInvest}
            />
          )}
          {visibleWithdraw && <WithdrawModalBody />}
        </>
      ) : (
        <Flex py={"20px"} width={"100%"} gridGap={"16px"} minWidth={"80vw"}>
          <Flex flex={1} col>
            <Flex
              mt={"4px"}
              fontFamily={"art"}
              fontSize={"20px"}
              fontWeight={"bold"}
              px={"10px"}
              pb={"6px"}
              borderBottom={"1px solid #34383b"}
            >
              Portfolio
              <Flex
                ml={"auto"}
                mt={"auto"}
                fontSize={"16px"}
                fontWeight={"normal"}
                gridGap={"16px"}
              >
                <Flex fontSize={"30px"} fontWeight={"bold"}>
                  48.29
                </Flex>
                <Flex fontSize={"30px"} fontWeight={"bold"}>
                  /
                </Flex>
                <Flex fontSize={"30px"} fontWeight={"bold"} color={"#70e094"}>
                  4.1%
                </Flex>
              </Flex>
            </Flex>
            <Flex p={"20px"}>
              <Flex flex={3} width={"0px"} p={"20px"} aspectRatio={"2"}>
                <ResponsiveContainer>
                  <PieChart
                    width={300}
                    height={300}
                    //style={{ cursor: cursor }}
                  >
                    <Tooltip content={<CustomizedTooltip />} />
                    <Pie
                      activeIndex={isHovered ? activeIndex : null}
                      activeShape={renderActiveShape}
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={"90%"}
                      fill="#8884d8"
                      stroke={"transparent"}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
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
              <Flex col flex={5} width={"0px"} aspectRatio={"2"}>
                <Flex ml={"auto"} gridGap={"4px"}>
                  <NormalBtn>1D</NormalBtn>
                  <NormalBtn>1W</NormalBtn>
                  <NormalBtn>1M</NormalBtn>
                </Flex>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={data2}
                    margin={{
                      top: 20,
                      right: 0,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 "
                      floodColor={"#70e094"}
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                    <Line
                      type="monotone"
                      dataKey="pv"
                      stroke="#70e094"
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Flex>
            </Flex>
            <Flex mt={"24px"} col>
              <Flex
                fontFamily={"art"}
                fontSize={"18px"}
                fontWeight={"600"}
                letterSpacing={"0.1em"}
                px={"10px"}
                pb={"6px"}
                borderBottom={"1px solid #34383b"}
              >
                Stats
              </Flex>
              <Flex justifyCenter>
                <Table width={"90%"} textAlign={"center"}>
                  <Thead>
                    <Tr>
                      <Th>Market Cap</Th>
                      <Th>Total Volume</Th>
                      <Th>Supply</Th>
                      <Th>Fee1</Th>
                      <Th>Fee2</Th>
                      <Th>NAV</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>10.5M</Td>
                      <Td>220.1K</Td>
                      <Td>8.2K</Td>
                      <Td>1%</Td>
                      <Td>2%</Td>
                      <Td>$47.28</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Flex>
            </Flex>
          </Flex>
          <BuySellSection
            setVisibleDeposit={setVisibleDeposit}
            setVisibleWithdraw={setVisibleWithdraw}
          />
        </Flex>
        // <Flex col gridGap={"10px"}>
        //   <Flex
        //     py={"8px"}
        //     fontSize={"18px"}
        //     fontWeight={"500"}
        //     borderBottom={"1px solid #34383b"}
        //   >
        //     Portfolio
        //   </Flex>
        //   <Flex justifyCenter gridGap={"16px"}>
        //     <Flex
        //       col
        //       background={"#302D38"}
        //       p={"20px"}
        //       border={"1px solid #34383b"}
        //       borderRadius={"20px"}
        //       gridGap={"12px"}
        //       {...props}
        //     >
        //       <Flex justifyCenter alignCenter gridGap={"16px"}>
        //         <Flex col>
        //           <Flex width={"150px"} aspectRatio={"1"}>
        //             <ResponsiveContainer>
        //               <PieChart width={300} height={300}>
        //                 <Tooltip content={<CustomizedTooltip />} />
        //                 <Pie
        //                   activeIndex={isHovered ? activeIndex : null}
        //                   activeShape={renderActiveShape}
        //                   data={data}
        //                   cx="50%"
        //                   cy="50%"
        //                   labelLine={false}
        //                   label={renderCustomizedLabel}
        //                   outerRadius={"90%"}
        //                   fill="#8884d8"
        //                   stroke={"transparent"}
        //                   dataKey="value"
        //                   onMouseEnter={onPieEnter}
        //                   onMouseLeave={onPieLeave}
        //                 >
        //                   {data.map((entry, index) => (
        //                     <Cell
        //                       key={`cell-${index}`}
        //                       fill={COLORS[index % COLORS.length]}
        //                     />
        //                   ))}
        //                 </Pie>
        //               </PieChart>
        //             </ResponsiveContainer>
        //           </Flex>
        //           <Flex justifyCenter gridGap={"8px"}>
        //             <Flex
        //               alignCenter
        //               gridGap={"4px"}
        //               padding={"8px 16px"}
        //               background={"#0002"}
        //               p={"8px 16px"}
        //               border={"1px solid #34383b"}
        //               borderRadius={"8px"}
        //               cursor="pointer"
        //               onClick={() => {
        //                 setVisibleDeposit(true);
        //               }}
        //             >
        //               Invest
        //             </Flex>
        //             <Flex
        //               alignCenter
        //               gridGap={"4px"}
        //               padding={"8px 16px"}
        //               background={"#0002"}
        //               p={"8px 16px"}
        //               border={"1px solid #34383b"}
        //               borderRadius={"8px"}
        //               cursor="pointer"
        //               onClick={() => {
        //                 setVisibleWithdraw(true);
        //               }}
        //             >
        //               Withdraw
        //             </Flex>
        //           </Flex>
        //         </Flex>
        //         <Flex col gridGap={"4px"}>
        //           <Flex col gridGap={"10px"}>
        //             <Flex col justifyCenter gridGap={"16px"}>
        //               <Table cellSpacing={"2px"}>
        //                 <Tbody>
        //                   <Tr>
        //                     <Td px={"4px"} py={"8px"} borderBottom={"none"}>
        //                       Pool Name:
        //                     </Td>
        //                     <Td
        //                       px={"4px"}
        //                       py={"8px"}
        //                       borderBottom={"none"}
        //                       color={"#888"}
        //                     >
        //                       {miraIndexInfo.poolName}
        //                     </Td>
        //                   </Tr>
        //                   <Tr>
        //                     <Td px={"4px"} py={"8px"} borderBottom={"none"}>
        //                       Pool owner:
        //                     </Td>
        //                     <Td
        //                       px={"4px"}
        //                       py={"8px"}
        //                       borderBottom={"none"}
        //                       color={"#888"}
        //                     >
        //                       <Flex justifyCenter alignCenter gridGap={"8px"}>
        //                         {miraIndexInfo.poolOwner}
        //                         {walletConnected &&
        //                           miraIndexInfo.poolOwner !== walletAddress &&
        //                           !isFriend && (
        //                             <Flex
        //                               alignCenter
        //                               gridGap={"4px"}
        //                               padding={"8px 16px"}
        //                               background={"#0005"}
        //                               p={"8px 16px"}
        //                               border={"1px solid #34383b"}
        //                               borderRadius={"8px"}
        //                               cursor="pointer"
        //                               onClick={() => request_friend()}
        //                             >
        //                               Request friend
        //                             </Flex>
        //                           )}
        //                       </Flex>
        //                     </Td>
        //                   </Tr>
        //                   <Tr>
        //                     <Td px={"4px"} py={"8px"} borderBottom={"none"}>
        //                       Pool address:
        //                     </Td>
        //                     <Td
        //                       px={"4px"}
        //                       py={"8px"}
        //                       borderBottom={"none"}
        //                       color={"#888"}
        //                     >
        //                       {miraIndexInfo.poolAddress}
        //                     </Td>
        //                   </Tr>
        //                   <Tr>
        //                     <Td px={"4px"} py={"8px"} borderBottom={"none"}>
        //                       Management Fee:
        //                     </Td>
        //                     <Td
        //                       px={"4px"}
        //                       py={"8px"}
        //                       borderBottom={"none"}
        //                       color={"#888"}
        //                     >
        //                       {miraIndexInfo.managementFee} %
        //                     </Td>
        //                   </Tr>
        //                   <Tr>
        //                     <Td px={"4px"} py={"8px"} borderBottom={"none"}>
        //                       Founded:
        //                     </Td>
        //                     <Td
        //                       px={"4px"}
        //                       py={"8px"}
        //                       borderBottom={"none"}
        //                       color={"#888"}
        //                     >
        //                       {miraIndexInfo.founded}
        //                     </Td>
        //                   </Tr>
        //                 </Tbody>
        //               </Table>
        //             </Flex>
        //           </Flex>
        //         </Flex>
        //       </Flex>
        //     </Flex>
        //   </Flex>
        // </Flex>
      )}
    </>
  );
};

type BuySellSectionProps = {
  setVisibleDeposit: (arg: boolean) => void;
  setVisibleWithdraw: (arg: boolean) => void;
};
const BuySellSection: React.FC<BuySellSectionProps> = ({
  setVisibleDeposit,
  setVisibleWithdraw,
}) => {
  const { walletConnected } = useWalletHook();
  const [isInvest, setInvest] = React.useState(true);
  return (
    <Flex
      col
      my={"auto"}
      justifyContent={"space-around"}
      gridGap={"10px"}
      background={"#302D38"}
      padding={"20px"}
      border={"1px solid #34383b"}
      borderRadius={"20px"}
    >
      <Flex
        mx={"auto"}
        fontFamily={"art"}
        fontSize={"20px"}
        fontWeight={"bold"}
      >
        Buy / Sell
      </Flex>
      <Flex
        mt={"1em"}
        fontSize={"16px"}
        alignCenter
        justifyContent={"space-around"}
      >
        <Flex
          cursor={"pointer"}
          onClick={() => setInvest(true)}
          color={isInvest ? "#d15151" : "#fafafa"}
        >
          Invest
        </Flex>
        <Link m={"auto 0px"} fontSize={"2em"} transform={"rotate(90deg)"}>
          <ExchangeIcon />
        </Link>
        <Flex
          cursor={"pointer"}
          onClick={() => setInvest(false)}
          color={!isInvest ? "#d15151" : "#fafafa"}
        >
          Withdraw
        </Flex>
      </Flex>
      <BuySellBox />

      {walletConnected ? (
        <ArtButton
          mt={"24px"}
          mx={"auto"}
          minWidth={"150px"}
          padding={"12px 24px"}
          textAlign={"center"}
          onClick={() =>
            isInvest ? setVisibleDeposit(true) : setVisibleWithdraw(true)
          }
        >
          {isInvest ? "INVEST" : "WITHDRAW"}
        </ArtButton>
      ) : (
        <ArtButton
          mt={"24px"}
          mx={"auto"}
          minWidth={"150px"}
          padding={"12px 24px"}
          textAlign={"center"}
        >
          Connect Wallet
        </ArtButton>
      )}
    </Flex>
  );
};

const BuySellBox = () => {
  return (
    <Flex
      col
      gridGap={"12px"}
      background={"#3c3a45"}
      width={"300px"}
      p={"12px 24px"}
      border={"1px solid #fff3"}
      borderRadius={"20px"}
    >
      <Flex alignCenter justifyContent={"space-between"}>
        <Flex col>
          <Flex color={"#70e094"} fontSize={"1.4em"} fontWeight={"bold"}>
            0.0
          </Flex>
          <Flex>$0.0</Flex>
        </Flex>
        <Flex bg={"#302d38"} borderRadius={"8px"}>
          <CustomSelect>
            <SmOption value={"APTOS"}>APTOS</SmOption>
            <SmOption value={"XSI"}>XSI</SmOption>
          </CustomSelect>
        </Flex>
      </Flex>
      <Flex alignCenter justifyContent={"flex-end"} gridGap={"8px"}>
        <Flex>Balance :</Flex>
        <Flex>10</Flex>
        <Link ml={"8px"} p={"4px 8px"} bg={"#26242f"} borderRadius={"4px"}>
          Max
        </Link>
      </Flex>
    </Flex>
  );
};
