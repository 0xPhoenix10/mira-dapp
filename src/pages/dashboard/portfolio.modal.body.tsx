import React, { useEffect, useState } from "react";
import { Flex } from "../../components/base/container";
import { Table, Tbody, Td, Tr, Th, Thead } from "../../components/base";
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

import {
  NormalBtn,
  AddBtn,
} from "components/elements/buttons";
import { ArrowIcon } from "components/icons";
import { MODULE_ADDR, NODE_URL, DECIMAL } from "../../config";
import { BuySellSection } from "pages/components";
import { AptosClient, AptosAccount, CoinClient } from "aptos";

interface IData {
  name: string;
  value: string | number;
}

interface DepositPoolEvent {
  pool_name: string;
  investor: string;
  amount: number;
  timestamp: string;
}

export const PortfolioModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  setUpdateInvest = () => {},
  miraIndexInfo = {},
  ...props
}) => {
  const { walletConnected, walletAddress, signAndSubmitTransaction } =
    useWalletHook();
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setHovered] = useState(false);
  const [isMore, setMoreBtn] = useState(false);
  const [estimateAmount, setEstimateAmount] = React.useState<string>("0.00");
  const [showPrice, setShowPrice] = React.useState<boolean>(false);
  const [dataRange, setDataRange] = useState("1D");
  const [chartData, setChartData] = useState([]);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [accountBalance, setAccountBalance] = useState<number>(0);

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
      getIndexDeposit();
      getAccountBalance();
    }
  }, [walletConnected, walletAddress]);

  const getIndexDeposit = async () => {
    const client = new AptosClient(NODE_URL);
    let deposit_amnt = 0;
    let withdraw_amnt = 0;

    if (!walletAddress) return;

    try {
      let events = await client.getEventsByEventHandle(
        MODULE_ADDR,
        `${MODULE_ADDR}::mira::MiraStatus`,
        "deposit_pool_events"
      );

      for (let ev of events) {
        let e: DepositPoolEvent = ev.data;

        if (
          e.pool_name !== miraIndexInfo.poolName ||
          walletAddress !== e.investor
        )
          continue;
        deposit_amnt = e ? e.amount / DECIMAL : 0;
      }
    } catch (error) {
      console.log("get index deposit error", error);
    }

    try {
      let events = await client.getEventsByEventHandle(
        MODULE_ADDR,
        `${MODULE_ADDR}::mira::MiraStatus`,
        "withdraw_pool_events"
      );

      for (let ev of events) {
        let e: DepositPoolEvent = ev.data;

        if (
          e.pool_name !== miraIndexInfo.poolName ||
          walletAddress !== e.investor
        )
          continue;
        withdraw_amnt = e ? e.amount / DECIMAL : 0;
      }
    } catch (error) {
      console.log("get index deposit error", error);
    }

    setDepositAmount(deposit_amnt - withdraw_amnt);
  };

  const getAccountBalance = async () => {
    const client = new AptosClient(NODE_URL);
    const aptos_account = new AptosAccount(undefined, walletAddress);
    const coin_client = new CoinClient(client);

    let balance = await coin_client.checkBalance(aptos_account);
    setAccountBalance(parseInt(balance.toString()) / DECIMAL);
  };

  const data = miraIndexInfo.indexAllocation ? miraIndexInfo.indexAllocation : []

  const data2 = [
    { month: "9/28", value: 486 },
    { month: "9/29", value: 432 },
    { month: "9/30", value: 543 },
    { month: "10/01", value: 552 },
    { month: "10/02", value: 234 },
    { month: "9/24", value: 394 },
    { month: "9/25", value: 205 },
    { month: "9/26", value: 542 },
    { month: "9/27", value: 123 },
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

  const deposit = async () => {
    if (!walletConnected) return;
    const transaction = {
      type: "entry_function_payload",
      function: `${MODULE_ADDR}::mira::invest`,
      type_arguments: [],
      arguments: [
        miraIndexInfo.poolName,
        miraIndexInfo.poolOwner,
        estimateAmount,
      ],
    };
    const result = await signAndSubmitTransaction(transaction);
  };

  const withdraw = async () => {
    if (!walletConnected) return;
    const transaction = {
      type: "entry_function_payload",
      function: `${MODULE_ADDR}::mira::withdraw`,
      type_arguments: [],
      arguments: [
        miraIndexInfo.poolName,
        miraIndexInfo.poolOwner,
        estimateAmount,
      ],
    };
    const result = await signAndSubmitTransaction(transaction);
  };
  const CustomizedTick2 = ({ x, y, payload }) => {
    return (
      <text
        style={{
          fontSize: "12px",
          float: "right",
          textAlign: "right",
          fill: "#fff",
        }}
        x={x - 24}
        y={y}
        textAnchor="top"
        dominantBaseline="hanging"
      >
        {payload.value}
      </text>
    );
  };

  const renderTooltip = (props) => {
    if (props && props.payload[0]) {
      return (
        <div
          style={{
            padding: "12px",
            background: "#222129",
            color: "#ffffff",
            fontSize: "12px",
          }}
        >
          <div>Value: {props.payload[0].payload.value}</div>
        </div>
      );
    }
  };

  const args = {
    chartData: data2,
    gradientColor: "green",
    areaStrokeColor: "cyan",
    customizedTick: CustomizedTick2,
    tickFormatter: null,
    renderTooltip: renderTooltip,
    uniqueId: 2,
  };
  useEffect(() => {
    getChartData();
  }, [dataRange]);
  const getChartData = () => {
    let arrTmp = [];
    for (let i = 0; i < 7; i++) {
      if (dataRange == "3D" && i > 2) {
        continue;
      }
      let m = "";
      switch (dataRange) {
        case "1D":
          m = `${(i + 1) * 2}:00`;
          break;
        case "3D":
          m = `10/${i + 4}`;
          break;
        case "1W":
          m = `10/${i + 10}`;
          break;
        case "1W":
          m = `10/${i + 7}`;
          break;
      }
      arrTmp.push({
        month: m,
        value: 100 + Math.floor(Math.random() * (500 - 100)),
      });
    }
    setChartData(arrTmp);
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
          {visibleDeposit && (
            <DepositModalBody
              setEstimateAmount={setEstimateAmount}
              setShowPrice={setShowPrice}
              setVisible={setVisibleDeposit}
            />
          )}
          {visibleWithdraw && (
            <WithdrawModalBody
              setEstimateAmount={setEstimateAmount}
              setShowPrice={setShowPrice}
              setVisible={setVisibleWithdraw}
            />
          )}
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
              <Flex color={"#70e094"}>
                {miraIndexInfo.poolName + " by " + miraIndexInfo.ownerName}
              </Flex>
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
                  {isMore ? (
                    <>
                      <NormalBtn onClick={() => setDataRange("1D")}>
                        1D
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("3D")}>
                        3D
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1W")}>
                        1W
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("2W")}>
                        2W
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1M")}>
                        1M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("3M")}>
                        3M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("6M")}>
                        6M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1Y")}>
                        1Y
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("YTD")}>
                        YTD
                      </NormalBtn>
                    </>
                  ) : (
                    <>
                      <NormalBtn onClick={() => setDataRange("1D")}>
                        1D
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1W")}>
                        1W
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("1M")}>
                        1M
                      </NormalBtn>
                      <NormalBtn onClick={() => setDataRange("YTD")}>
                        YTD
                      </NormalBtn>
                    </>
                  )}
                  <AddBtn
                    onClick={() =>
                      isMore ? setMoreBtn(false) : setMoreBtn(true)
                    }
                  >
                    {isMore ? "-" : "+"}
                  </AddBtn>
                </Flex>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 10, left: -30, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={"colorUv" + args.uniqueId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="100%" stopColor={args.gradientColor} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={args.customizedTick} />
                    <YAxis
                      width={80}
                      tick={args.customizedTick}
                      // ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      interval={0}
                      domain={[1, 15]}
                      tickFormatter={args.tickFormatter}
                    />
                    <CartesianGrid
                      strokeDasharray="5 5"
                      fill="#222129"
                      horizontal={false}
                      vertical={false}
                    />
                    <Tooltip content={args.renderTooltip} />
                    <Area
                      dot={{ fill: args.gradientColor, fillOpacity: 1 }}
                      type="monotone"
                      dataKey="value"
                      stroke={args.gradientColor}
                      fillOpacity={0.1}
                      fill={"url(#colorUv" + args.uniqueId + ")"}
                    />
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
            depositAmnt={depositAmount}
            accountBalance={accountBalance}
          />
        </Flex>
      )}
    </>
  );
};
