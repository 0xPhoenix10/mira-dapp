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
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { renderActiveShape } from "../../common/recharts/piechart";
import { NormalBtn, AddBtn } from "components/elements/buttons";
import { ArrowIcon } from "components/icons";
import { BuySellSection } from "pages/components";

interface IData {
  name: string;
  value: string | number;
}

export const PortfolioModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => { },
  setUpdateInvest = () => { },
  miraIndexInfo = {},
  ...props
}) => {
  const { walletConnected, walletAddress } = useWalletHook();
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setHovered] = useState(false);
  const [isMore, setMoreBtn] = useState(false);

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
    { month: "9/24", value: 394 },
    { month: "9/25", value: 205 },
    { month: "9/26", value: 542 },
    { month: "9/27", value: 123 },
    { month: "9/28", value: 486 },
    { month: "9/29", value: 432 },
    { month: "9/30", value: 543 },
    { month: "10/01", value: 552 },
    { month: "10/02", value: 234 },
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

  const CustomizedTick2 = ({ x, y, payload }) => {
    return <text style={{ fontSize: "12px", float: "right", textAlign: "right", fill: "#fff" }} x={x - 24} y={y} textAnchor="top" dominantBaseline="hanging">
      {payload.value}
    </text>
  }

  const renderTooltip = (props) => {
    if (props && props.payload[0]) {
      return (
        <div style={{ padding: "12px", background: "#222129", color: "#ffffff", fontSize: "12px" }}>
          <div>Value: {props.payload[0].payload.value}</div>
        </div>
      )
    }
  }

  const args = {
    chartData: data2,
    gradientColor: "green",
    areaStrokeColor: "cyan",
    customizedTick: CustomizedTick2,
    tickFormatter: null,
    renderTooltip: renderTooltip,
    uniqueId: 2,
  }

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
              <Flex color={"#70e094"}>Mira</Flex>
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
                  {isMore && (
                    <>
                      <NormalBtn>1D</NormalBtn>
                      <NormalBtn>3D</NormalBtn>
                      <NormalBtn>1W</NormalBtn>
                      <NormalBtn>2W</NormalBtn>
                      <NormalBtn>1M</NormalBtn>
                      <NormalBtn>3M</NormalBtn>
                      <NormalBtn>6M</NormalBtn>
                      <NormalBtn>1Y</NormalBtn>
                      <NormalBtn>YTD</NormalBtn>
                    </>
                  )}
                  {!isMore && (
                    <>
                      <NormalBtn>1D</NormalBtn>
                      <NormalBtn>1W</NormalBtn>
                      <NormalBtn>1M</NormalBtn>
                      <NormalBtn>YTD</NormalBtn>
                    </>
                  )}
                  <AddBtn
                    onClick={() => isMore ? setMoreBtn(false) : setMoreBtn(true)}
                  >
                    {isMore ? "-" : "+"}
                  </AddBtn>
                </Flex>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={args.chartData}
                    margin={{ top: 20, right: 10, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id={"colorUv" + args.uniqueId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="100%" stopColor={args.gradientColor} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      tick={args.customizedTick}
                    />
                    <YAxis
                      width={80}
                      tick={args.customizedTick}
                      // ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      interval={0}
                      domain={[1, 15]}
                      tickFormatter={args.tickFormatter}
                    />
                    <CartesianGrid strokeDasharray="5 5" fill="#222129" horizontal={false} vertical={false} />
                    <Tooltip content={args.renderTooltip} />
                    <Area dot={{ fill: args.gradientColor, fillOpacity: 1 }} type="monotone" dataKey="value" stroke={args.gradientColor} fillOpacity={0.1} fill={"url(#colorUv" + args.uniqueId + ")"} />
                  </AreaChart>
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
            miraInfo={miraIndexInfo}
          />
        </Flex>
      )}
    </>
  );
};