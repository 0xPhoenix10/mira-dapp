import {
  Box,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
} from "components/base";
import { Flex } from "components/base/container";
import { CustomSelect, RadioBtn, SmOption } from "components/form";
import {
  ArrowIcon,
  CheckIcon,
  CreateIcon,
  SearchIcon,
  TimesIcon,
  ExchangeIcon,
  FilterIcon,
  WarningIcon,
  IconNarrow,
  SortDirIcon,
} from "components/icons";
import { CustomTooltip } from "components/elements/tooptip";
import React, { useEffect, useContext, useState } from "react";
import { FriendStatus, getFriendData, requestFriend } from "../utils/graphql";
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
import { useNavigate } from "react-router-dom";
import { FEE_DECIMAL, MODULE_ADDR } from "../config";
import { useWalletHook } from "../common/hooks/wallet";
import { UpdateIndexProviderContext } from "./dashboard";
import { PortfolioModalBody } from "./dashboard/portfolio.modal.body";
import DepositModalBody from "./dashboard/deposit.modal.body";
import WithdrawModalBody from "./dashboard/withdraw.modal.body";
import { renderActiveShape } from "../common/recharts/piechart";
import { ArtButton, NormalBtn } from "components/elements/buttons";
import { IndexAllocation } from "../utils/types";
import { IndexAllocationModalBody } from "./index.allocation.modal";

interface ChartBoxProps {
  title?: string;
  [index: string]: any;
}

interface IData {
  name: string;
  value: string | number;
}

export const ChartBox: React.FC<ChartBoxProps> = ({
  title = "Chart Box",
  cursor = "revert",
  onClick = () => {},
  cursorAll,
  onClickAll = () => {},
  ...props
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setHovered] = React.useState(false);

  const data = [
    { name: "WORM", value: 350 },
    { name: "PYTH", value: 300 },
    { name: "CLOCK", value: 200 },
    { name: "OTTER", value: 400 },
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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN) + 5;

    if(data.length < 5) {
      return (
        <text
          fontSize={"10px"}
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="center"
        >
          {/* {`${(percent * 100).toFixed(0)}%`} */}
          {`${data[index].name}`}
        </text>
      );
    }
  };

  const style = {
    backgroundColor: "lightgrey",
    color: "black",
    padding: "2px 20px",
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
    <Flex
      col
      background={"#302d38"}
      p={"20px"}
      border={"1px solid #34383b"}
      borderRadius={"20px"}
      gridGap={"12px"}
      {...props}
    >
      <Flex
        justifyCenter
        alignCenter
        gridGap={"16px"}
        cursor={cursorAll}
        onClick={onClickAll}
      >
        <Flex width={"40%"} aspectRatio={"1"}>
          <ResponsiveContainer>
            <PieChart
              width={300}
              height={300}
              onClick={onClick}
              style={{ cursor: cursor }}
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
        <Flex col gridGap={"4px"} color={"lightgrey"} cursor={"pointer"} alignItems={"end"}>
          <Flex
            mb={"8px"}
            fontSize={"18px"}
            fontWeight={"bold"}
            color={"#70e094"}
            mx={"auto"}
          >
            Mira
          </Flex>
          <CustomTooltip
            title="today's market performance"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={"8px"}>
              <Box>1d ⓘ</Box>
              <Box>:</Box>
              <Box>0.2%</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="this week's performance"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={"8px"}>
              <Box>1w ⓘ</Box>
              <Box>:</Box>
              <Box>4.1%</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="this year's performance"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={"8px"}>
              <Box>1y ⓘ</Box>
              <Box>:</Box>
              <Box>18.5%</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="the Sharpe Ratio measures risk to reward on a scale from 0-1."
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={"8px"}>
              <Box>Sharpe Ratio ⓘ</Box>
              <Box>:</Box>
              <Box>0.23</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="Total Value Locked measures the total amount of funds deposited"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={"8px"}>
              <Box>TVL ⓘ</Box>
              <Box>:</Box>
              <Box>3.2M</Box>
            </Flex>
          </CustomTooltip>
          <CustomTooltip
            title="Mira approves of this fund strategy as expert-crafted"
            arrow
            disableInteractive
            placement="top"
          >
            <Flex gridGap={"8px"}>
              <Box>Expert ⓘ</Box>
              <Box>:</Box>
              <Box>✓</Box>
            </Flex>
          </CustomTooltip>
        </Flex>
      </Flex>
      <Box fontSize={"16px"} fontWeight={"bold"}>
        {title}
      </Box>
    </Flex>
  );
};

interface BlankCardProps {
  type?: "invest" | "index";
  [index: string]: any;
}

export const BlankCard: React.FC<BlankCardProps> = ({
  type = "invest",
  ...props
}) => {
  return (
    <Flex
      col
      background={"#302d38"}
      p={"20px"}
      border={"1px solid #34383b"}
      borderRadius={"20px"}
      gridGap={"12px"}
      {...props}
    >
      <Flex justifyCenter pt={"50px"} alignCenter gridGap={"16px"}>
        <Flex aspectRatio={"1"} color={"lightgrey"}>
          <WarningIcon size="40px" />
        </Flex>
        <Flex col gridGap={"4px"} color={"lightgrey"}>
          <p
            style={{
              fontSize: "16px",
            }}
          >
            {type === "invest" &&
              "You haven't invested in any portfolios yet. Check out Our Tokens or browse the Leaderboard to get started!"}
            {type === "index" &&
              "You haven't created an index yet. Click here to get started!"}
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface IndexModalBodyProps {
  type?: "modify" | "create";
  [index: string]: any;
}
export const IndexModalBody: React.FC<IndexModalBodyProps> = ({
  type = "modify",
  setVisible = () => {},
  setAllocationVisible = () => {},
  allocationData = [],
  ...props
}) => {
  const { walletConnected, signAndSubmitTransaction } = useWalletHook();
  const [nameValue, setNameValue] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [managementFee, setManagementFee] = useState<number>(0);
  const [rebalancingPeriod, setRebalancingPeriod] = useState<number>(0);
  const [minimumContribution, setMiniumContribution] = useState<number>(0);
  const [miniumWithdrawal, setMiniumWithdrawal] = useState<number>(0);
  const [privateAllocation, setPrivateAlloation] = useState<boolean>(false);
  const [referralReward, setReferralReward] = useState<number>(0);
  const [openMoreSetting, setOpenMoreSetting] = useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setHovered] = React.useState(false);

  const COLORS = [
    "#5a9e47",
    "#23b5b5",
    "#527da7",
    "#d4901c",
    "#3d6595",
    "#345882",
  ];

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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);

  const { updateIndex, setUpdateIndex } = useContext(
    UpdateIndexProviderContext
  );

  const create_index = async () => {
    if (!walletConnected) return;

    let pool_name = nameValue.trim();
    let total_amount = totalAmount;
    let management_fee = managementFee * FEE_DECIMAL;
    let rebalancing_period = rebalancingPeriod * 1;
    let minimum_contribution = minimumContribution * FEE_DECIMAL;
    let minimum_withdrawal = miniumWithdrawal * 1;
    let referral_reward = referralReward * FEE_DECIMAL;

    let index_allocation_key: string[] = [];
    let index_allocation_value: number[] = [];
    let sum = 0;
    allocationData.forEach((data: any) => {
      index_allocation_key.push(data.name);
      index_allocation_value.push(data.value);
      sum += data.value;
    });
    if (sum !== 100) return;

    let private_allocation = privateAllocation;

    if (pool_name === "") return;
    if (total_amount < 1) return;
    if (management_fee < 0 || managementFee > 100) return;
    if (minimum_contribution < 0 || minimum_contribution > 10000) return;

    const transaction = {
      type: "entry_function_payload",
      function: `${MODULE_ADDR}::mira::create_pool`,
      type_arguments: [],
      arguments: [
        pool_name,
        total_amount,
        management_fee,
        rebalancing_period,
        minimum_contribution,
        minimum_withdrawal,
        referral_reward,
        index_allocation_key,
        index_allocation_value,
        private_allocation,
      ],
    };
    console.log(transaction);
    const result = await signAndSubmitTransaction(transaction);
    if (result) {
      setUpdateIndex(!updateIndex);
      setVisible(false);
    }
  };

  const style = {
    backgroundColor: "#000",
    color: "lightgrey",
    padding: "2px 15px",
    fontSize: "12px",
  };

  const CustomizedTooltip = React.memo((props: any) => {
    if (props.payload.length > 0) {
      const sum = allocationData.reduce((a, v) => (a = a + v.value), 0);

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
            {type === "modify" && "Modify My Index"}
            {type === "create" && "Create My Index"}
          </Flex>
          <Flex justifyCenter gridGap={"16px"}>
            <Flex
              col
              background={"#302d38"}
              p={"20px"}
              border={"1px solid #34383b"}
              borderRadius={"20px"}
              gridGap={"12px"}
              {...props}
            >
              <Flex justifyCenter gridGap={"16px"} alignCenter>
                {(type === "modify" || type === "create") && (
                  <Flex col>
                    <Flex width={"200px"} aspectRatio={"1"}>
                      <ResponsiveContainer>
                        {allocationData && Array.isArray(allocationData) && (
                          <PieChart
                            width={300}
                            height={300}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              // if (type === "modify") setVisibleAllocation(true);
                              setAllocationVisible(true);
                            }}
                          >
                            <Tooltip content={<CustomizedTooltip />} />
                            <Pie
                              activeIndex={isHovered ? activeIndex : null}
                              activeShape={renderActiveShape}
                              data={allocationData}
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
                              {allocationData.map(
                                (entry: any, index: number) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 4]}
                                  />
                                )
                              )}
                            </Pie>
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </Flex>
                    {type === "modify" && (
                      <Flex justifyCenter gridGap={"8px"}>
                        <Flex
                          alignCenter
                          gridGap={"4px"}
                          padding={"8px 16px"}
                          background={"#0005"}
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
                          background={"#0005"}
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
                    )}
                  </Flex>
                )}
                <Flex
                  col
                  gridGap={"4px"}
                  minWidth={"395px"}
                  minHeight={"310px"}
                  justifyCenter
                >
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Name :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            p={"4px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <Input
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              readOnly={type === "modify"}
                              onChange={(e) => {
                                setNameValue(e.target.value);
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Deposit amount :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            p={"4px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <Input
                              flex={"1"}
                              type={"number"}
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              max={"100"}
                              min={"0"}
                              readOnly={type === "modify"}
                              onChange={(e) => {
                                setTotalAmount(parseInt(e.target.value));
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Management fee :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            p={"4px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <Input
                              flex={"1"}
                              type={"number"}
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              max={"100"}
                              min={"0"}
                              readOnly={type === "modify"}
                              onChange={(e) => {
                                setManagementFee(parseInt(e.target.value));
                              }}
                            />
                            %
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Rebalancing :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            px={"4px"}
                            py={"1px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <CustomSelect
                              flex={"1"}
                              onChange={(e: number) => {
                                setRebalancingPeriod(e);
                              }}
                              value={0}
                            >
                              <SmOption value="0">1 Day</SmOption>
                              <SmOption value="1">1 Week</SmOption>
                              <SmOption value="2">2 Weeks</SmOption>
                              <SmOption value="3">1 Month</SmOption>
                              <SmOption value="4">2 Months</SmOption>
                            </CustomSelect>
                          </Flex>
                        </Td>
                      </Tr>
                      {openMoreSetting && (
                        <>
                          <Tr>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              Minimum Contribution :
                            </Td>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              <Flex
                                alignCenter
                                p={"4px"}
                                borderBottom={"1px solid #34383b"}
                              >
                                <Input
                                  flex={"1"}
                                  border={"none"}
                                  background={"transparent"}
                                  color={"white"}
                                  placeholder={"input here..."}
                                  readOnly={type === "modify"}
                                  onChange={(e) => {
                                    setMiniumContribution(
                                      parseInt(e.target.value)
                                    );
                                  }}
                                />
                                %
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              Minimum Withdrawal Period :
                            </Td>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              <Flex
                                alignCenter
                                px={"4px"}
                                py={"1px"}
                                borderBottom={"1px solid #34383b"}
                              >
                                <CustomSelect
                                  flex={"1"}
                                  value={"0"}
                                  onChange={(e: number) => {
                                    setMiniumWithdrawal(e);
                                  }}
                                >
                                  <SmOption value="0">1 Day</SmOption>
                                  <SmOption value="1">1 Week</SmOption>
                                  <SmOption value="2">2 Weeks</SmOption>
                                  <SmOption value="3">1 Month</SmOption>
                                  <SmOption value="4">2 Months</SmOption>
                                </CustomSelect>
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              Public/Private Allocation :
                            </Td>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              <Flex
                                alignCenter
                                p={"4px"}
                                borderBottom={"1px solid #34383b"}
                                gridGap={"20px"}
                              >
                                <RadioBtn
                                  name={"private_allocation"}
                                  value={"0"}
                                  title={"false"}
                                  selected
                                  onChange={(e: any) => {
                                    setPrivateAlloation(false);
                                  }}
                                />
                                <RadioBtn
                                  name={"private_allocation"}
                                  value={"1"}
                                  title={"true"}
                                  onChange={(e: any) => {
                                    setPrivateAlloation(true);
                                  }}
                                />
                              </Flex>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              Referral Rewards :
                            </Td>
                            <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                              <Flex
                                alignCenter
                                p={"4px"}
                                borderBottom={"1px solid #34383b"}
                              >
                                <Input
                                  flex={"1"}
                                  border={"none"}
                                  background={"transparent"}
                                  color={"white"}
                                  placeholder={"input here..."}
                                  readOnly={type === "modify"}
                                  onChange={(e) => {
                                    setReferralReward(parseInt(e.target.value));
                                  }}
                                />
                                %
                              </Flex>
                            </Td>
                          </Tr>
                        </>
                      )}

                      <Tr>
                        <Td
                          px={"4px"}
                          py={"2px"}
                          borderBottom={"none"}
                          cursor={"pointer"}
                          onClick={() => setOpenMoreSetting(!openMoreSetting)}
                          color={"#ab9b4e"}
                          style={{ textDecoration: "underline" }}
                        >
                          {openMoreSetting ? "Hide..." : "Advanced Settings..."}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                  <Flex gridGap={"8px"}>
                    {type === "modify" ? (
                      <>
                        <Flex
                          alignCenter
                          gridGap={"4px"}
                          ml={"auto"}
                          padding={"8px 16px"}
                          background={"#0005"}
                          p={"8px 16px"}
                          border={"1px solid #34383b"}
                          borderRadius={"8px"}
                          cursor="pointer"
                        >
                          <CheckIcon size={"1.2em"} />
                          Save
                        </Flex>
                        <Flex
                          alignCenter
                          gridGap={"4px"}
                          padding={"8px 16px"}
                          background={"#0005"}
                          p={"8px 16px"}
                          border={"1px solid #34383b"}
                          borderRadius={"8px"}
                          cursor="pointer"
                          onClick={() => {
                            setVisible(false);
                          }}
                        >
                          <TimesIcon size={"1.2em"} />
                          Cancel
                        </Flex>
                      </>
                    ) : (
                      <Flex
                        alignCenter
                        gridGap={"4px"}
                        ml={"auto"}
                        padding={"8px 16px"}
                        background={"#0005"}
                        p={"8px 16px"}
                        border={"1px solid #34383b"}
                        borderRadius={"8px"}
                        cursor="pointer"
                        onClick={() => create_index()}
                      >
                        <CreateIcon size={"1.2em"} />
                        Publish
                      </Flex>
                    )}
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

export const UpdateModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  ...props
}) => {
  const [nameValue, setNameValue] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [managementFee, setManagementFee] = useState<number>(0);
  const [rebalancingPeriod, setRebalancingPeriod] = useState<number>(0);
  const [minimumContribution, setMiniumContribution] = useState<number>(0);
  const [miniumWithdrawal, setMiniumWithdrawal] = useState<number>(0);
  const [privateAllocation, setPrivateAlloation] = useState<boolean>(false);
  const [referralReward, setReferralReward] = useState<number>(0);
  const [openMoreSetting, setOpenMoreSetting] = useState(false);

  return (
    <Flex col gridGap={"10px"}>
      <Flex
        py={"8px"}
        fontSize={"18px"}
        fontWeight={"500"}
        borderBottom={"1px solid #34383b"}
      >
        Update Settings
      </Flex>
      <Flex justifyCenter gridGap={"16px"}>
        <Flex
          col
          background={"#302d38"}
          p={"20px"}
          border={"1px solid #34383b"}
          borderRadius={"20px"}
          gridGap={"12px"}
          {...props}
        >
          <Flex justifyCenter gridGap={"16px"} alignCenter>
            <Flex
              col
              gridGap={"4px"}
              minWidth={"395px"}
              minHeight={"310px"}
              justifyCenter
            >
              <Table>
                <Tbody>
                  <Tr>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      Name :
                    </Td>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      <Flex
                        alignCenter
                        p={"4px"}
                        borderBottom={"1px solid #34383b"}
                      >
                        <Input
                          border={"none"}
                          background={"transparent"}
                          color={"white"}
                          placeholder={"input here..."}
                          readOnly={true}
                          onChange={(e) => {
                            setNameValue(e.target.value);
                          }}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      Deposit amount :
                    </Td>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      <Flex
                        alignCenter
                        p={"4px"}
                        borderBottom={"1px solid #34383b"}
                      >
                        <Input
                          flex={"1"}
                          type={"number"}
                          border={"none"}
                          background={"transparent"}
                          color={"white"}
                          placeholder={"input here..."}
                          max={"100"}
                          min={"0"}
                          onChange={(e) => {
                            setTotalAmount(parseInt(e.target.value));
                          }}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      Management fee :
                    </Td>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      <Flex
                        alignCenter
                        p={"4px"}
                        borderBottom={"1px solid #34383b"}
                      >
                        <Input
                          flex={"1"}
                          type={"number"}
                          border={"none"}
                          background={"transparent"}
                          color={"white"}
                          placeholder={"input here..."}
                          max={"100"}
                          min={"0"}
                          onChange={(e) => {
                            setManagementFee(parseInt(e.target.value));
                          }}
                        />
                        %
                      </Flex>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      Rebalancing :
                    </Td>
                    <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                      <Flex
                        alignCenter
                        px={"4px"}
                        py={"1px"}
                        borderBottom={"1px solid #34383b"}
                      >
                        <CustomSelect
                          flex={"1"}
                          onChange={(e: number) => {
                            setRebalancingPeriod(e);
                          }}
                          value={0}
                        >
                          <SmOption value="0">1 Day</SmOption>
                          <SmOption value="1">1 Week</SmOption>
                          <SmOption value="2">2 Weeks</SmOption>
                          <SmOption value="3">1 Month</SmOption>
                          <SmOption value="4">2 Months</SmOption>
                        </CustomSelect>
                      </Flex>
                    </Td>
                  </Tr>
                  {openMoreSetting && (
                    <>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Minimum Contribution :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            p={"4px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <Input
                              flex={"1"}
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              onChange={(e) => {
                                setMiniumContribution(parseInt(e.target.value));
                              }}
                            />
                            %
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Minimum Withdrawal Period :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            px={"4px"}
                            py={"1px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <CustomSelect
                              flex={"1"}
                              value={"0"}
                              onChange={(e: number) => {
                                setMiniumWithdrawal(e);
                              }}
                            >
                              <SmOption value="0">1 Day</SmOption>
                              <SmOption value="1">1 Week</SmOption>
                              <SmOption value="2">2 Weeks</SmOption>
                              <SmOption value="3">1 Month</SmOption>
                              <SmOption value="4">2 Months</SmOption>
                            </CustomSelect>
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Public/Private Allocation :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            p={"4px"}
                            borderBottom={"1px solid #34383b"}
                            gridGap={"20px"}
                          >
                            <RadioBtn
                              name={"private_allocation"}
                              value={"0"}
                              title={"false"}
                              selected
                              onChange={(e: any) => {
                                setPrivateAlloation(false);
                              }}
                            />
                            <RadioBtn
                              name={"private_allocation"}
                              value={"1"}
                              title={"true"}
                              onChange={(e: any) => {
                                setPrivateAlloation(true);
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Referral Rewards :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex
                            alignCenter
                            p={"4px"}
                            borderBottom={"1px solid #34383b"}
                          >
                            <Input
                              flex={"1"}
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              onChange={(e) => {
                                setReferralReward(parseInt(e.target.value));
                              }}
                            />
                            %
                          </Flex>
                        </Td>
                      </Tr>
                    </>
                  )}

                  <Tr>
                    <Td
                      px={"4px"}
                      py={"2px"}
                      borderBottom={"none"}
                      cursor={"pointer"}
                      onClick={() => setOpenMoreSetting(!openMoreSetting)}
                      color={"#ab9b4e"}
                      style={{ textDecoration: "underline" }}
                    >
                      {openMoreSetting ? "Hide..." : "Advanced Settings..."}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <Flex gridGap={"8px"}>
                <Flex
                  alignCenter
                  gridGap={"4px"}
                  ml={"auto"}
                  padding={"8px 16px"}
                  background={"#0005"}
                  p={"8px 16px"}
                  border={"1px solid #34383b"}
                  borderRadius={"8px"}
                  cursor="pointer"
                >
                  <CheckIcon size={"1.2em"} />
                  Save
                </Flex>
                <Flex
                  alignCenter
                  gridGap={"4px"}
                  padding={"8px 16px"}
                  background={"#0005"}
                  p={"8px 16px"}
                  border={"1px solid #34383b"}
                  borderRadius={"8px"}
                  cursor="pointer"
                  onClick={() => {
                    setVisible(false);
                  }}
                >
                  <TimesIcon size={"1.2em"} />
                  Cancel
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const IndexListModalBody: React.FC<{ [index: string]: any }> = ({
  title = "???",
  ...props
}) => {
  const navigate = useNavigate();

  const miraIndexes = [
    {
      poolName: "ha",
      poolAddress:
        "0xecc36a4b515e44347d40333db3b8aab14971a65e41819159e1ad9182f6006c41",
      poolOwner:
        "0xb7273e97383c1c0d77c548b6d7ab903748c6a7fd8406ca8e3d6560294e9c8102",
      managementFee: "1",
      founded: "Sep 30, 2022",
    },
    {
      poolName: "10",
      poolAddress:
        "0xe28c78edbc8ee93447f488618aab75e60767f05655fec16736d17ec8e9373b08",
      poolOwner:
        "0xa464f9110ebd5fb70bb56f16b9d863de6221c221c40c7d2ff147fd20e4af5d46",
      managementFee: "10",
      founded: "Oct 3, 2022",
    },
    {
      poolName: "testttt",
      poolAddress:
        "0xe3cf662714c1524d0ed2f61e2e903508878fd9e418532814cd196eb28a7a44be",
      poolOwner:
        "0xb7273e97383c1c0d77c548b6d7ab903748c6a7fd8406ca8e3d6560294e9c8102",
      managementFee: "1",
      founded: "Oct 3, 2022",
    },
    {
      poolName: "abcd",
      poolAddress:
        "0x78e1616a36923d36b9c0a5d8a41c51302fe45bd2a6bdbfb1a6f24d78385e8715",
      poolOwner:
        "0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26",
      managementFee: "1",
      founded: "Oct 3, 2022",
    },
    {
      poolName: "newtest",
      poolAddress:
        "0xc8ff8558f31b7406af670e6117befabfd3473945f4a7c8a9e1652f1e1f51e196",
      poolOwner:
        "0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26",
      managementFee: "1",
      founded: "Oct 3, 2022",
    },
    {
      poolName: "a",
      poolAddress:
        "0xc295f421b4c792144e569c389137d861e3cad0459256286696cd375771aef4b9",
      poolOwner:
        "0xc4603e82c3cf11b69c127b77252d874687e9f8e45094be73343f18b35d91f26e",
      managementFee: "5",
      founded: "Oct 4, 2022",
    },
    {
      poolName: "test2",
      poolAddress:
        "0x3c1d1c2cae08702ed7b099fe6086da87353f932ae86399f4802b7a9dd1a6552e",
      poolOwner:
        "0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26",
      managementFee: "0",
      founded: "Oct 5, 2022",
    },
    {
      poolName: "mira-test-1",
      poolAddress:
        "0xd59fba7334a7e79bba413ca4fa19264e24f90a2c0c2b5dbe179e8014215f50f8",
      poolOwner:
        "0xb5424c1606664d839e855aee375aaa0becbcdf908f374b09616b7f3df1b5f4d0",
      managementFee: "1",
      founded: "Oct 7, 2022",
    },
    {
      poolName: "son",
      poolAddress:
        "0x3033e5036f7d68cf22abfc8ba4aa5ff2d53edfafefd1116d9f35e039f6eb376a",
      poolOwner:
        "0x1956d5ee9a7a0e9679ba9fd797f6846e0a7766d71ba8a8fdbb3fb6251d0f2dc7",
      managementFee: "1",
      founded: "Oct 7, 2022",
    },
    {
      poolName: "test1",
      poolAddress:
        "0x9df806e12d20fc0afc6bcd9b455cb0b4b6bfab1a4137517f9367d6cd75973d46",
      poolOwner:
        "0x405bdfc954f3e04d7ba4abe80912ee7d323ec4d3757cba9dbfffc713083fd1cb",
      managementFee: "1",
      founded: "Oct 7, 2022",
    },
    {
      poolName: "name1",
      poolAddress:
        "0xf008e478616d5550ed814d487868545342e5cf40028fdfa2ac89d52c4ddbe764",
      poolOwner:
        "0x5ed9883e2cbf957dd7525357df0e51f592d4210ac9000f5554b355243efe0b03",
      managementFee: "3",
      founded: "Oct 9, 2022",
    },
    {
      poolName: "BestIndex",
      poolAddress:
        "0x33118fea32ff8a208eb704ff5d85b449ed239b1a848ffee57c477d3709e5c32",
      poolOwner:
        "0x598f9b869e6879d7daf0efcfff9c60f78ff7e772e94887885fb743121843e117",
      managementFee: "1",
      founded: "Oct 9, 2022",
    },
    {
      poolName: "abc",
      poolAddress:
        "0xbea557fa971d797e122f7e253f235dc42a3af0a0d1d99829a07ffba3e68199c4",
      poolOwner:
        "0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26",
      managementFee: "10",
      founded: "Oct 10, 2022",
    },
    {
      poolName: "ab",
      poolAddress:
        "0x2b652d569785137b5a1851d4c72b67ec2dc50ccefc7ddb23037113569811a302",
      poolOwner:
        "0xb4793170e2a45111d813f39c3d746b9e77b5aab1b88c30047d759d9f351e1a26",
      managementFee: "1",
      founded: "Oct 10, 2022",
    },
  ];

  const [visiblePortfolio, setVisiblePortfolio] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [sortDir, setSortDir] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean>(false);
  const [managementFeeMin, setMmanagementFeeMin] = useState("");
  const [managementFeeMax, setMmanagementFeeMax] = useState("");
  const [foundedMin, setFoundedMin] = useState("");
  const [foundedMax, setFoundedMax] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setSearchValue(window.localStorage.getItem("modal_searchValue"));
    setSortDir(window.localStorage.getItem("modal_sortDir") === "true");
    setSortValue(window.localStorage.getItem("modal_sortValue"));
    setActiveFilter(
      window.localStorage.getItem("modal_activeFilter") === "true"
    );
    setMmanagementFeeMin(window.localStorage.getItem("modal_managementFeeMin"));
    setMmanagementFeeMax(window.localStorage.getItem("modal_managementFeeMax"));
    setFoundedMin(window.localStorage.getItem("modal_foundedMin"));
    setFoundedMax(window.localStorage.getItem("modal_foundedMax"));
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("modal_searchValue", searchValue);
    window.localStorage.setItem("modal_sortDir", sortDir ? "true" : "false");
    window.localStorage.setItem("modal_sortValue", sortValue);
    window.localStorage.setItem(
      "modal_activeFilter",
      activeFilter ? "true" : "false"
    );
    window.localStorage.setItem("modal_managementFeeMin", managementFeeMin);
    window.localStorage.setItem("modal_managementFeeMax", managementFeeMax);
    window.localStorage.setItem("modal_foundedMin", foundedMin);
    window.localStorage.setItem("modal_foundedMax", foundedMax);
  }, [
    searchValue,
    sortDir,
    sortValue,
    activeFilter,
    managementFeeMin,
    managementFeeMax,
    foundedMin,
    foundedMax,
  ]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [indexAllocationModalVisible, setIndexAllocationModalVisible] =
    useState(false);
  const [allocationData, setAllocationData] = useState<IndexAllocation[]>([
    {
      name: "BTC",
      value: 50,
    },
    {
      name: "USDT",
      value: 50,
    },
  ]);

  return (
    <>
      {visiblePortfolio || updateModalVisible || indexAllocationModalVisible ? (
        <>
          <Flex
            background={"#0005"}
            p={"8px 16px"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            ml={"auto"}
            cursor="pointer"
            onClick={() => {
              if (updateModalVisible || indexAllocationModalVisible) {
                setVisiblePortfolio(true);
              } else {
                setVisiblePortfolio(false);
              }
              setUpdateModalVisible(false);
              setIndexAllocationModalVisible(false);
            }}
            zIndex={"0"}
          >
            <ArrowIcon dir={"left"} />
          </Flex>
          {visiblePortfolio && (
            <ModifyModalBody
              flex={1}
              setUpdateVisible={(bValue) => {
                setUpdateModalVisible(bValue);
                setVisiblePortfolio(false);
              }}
              setAllocationVisible={(bValue) => {
                setIndexAllocationModalVisible(bValue);
                setVisiblePortfolio(false);
              }}
              allocationData={allocationData}
            />
          )}
          {updateModalVisible && <UpdateModalBody />}
          {indexAllocationModalVisible && (
            <IndexAllocationModalBody
              flex={1}
              type={"create"}
              allocationData={allocationData}
              setAllocationData={setAllocationData}
            />
          )}
        </>
      ) : (
        <Flex col gridGap={"10px"}>
          <Flex
            alignCenter
            gridGap={"8px"}
            py={"8px"}
            fontSize={"18px"}
            fontWeight={"500"}
            borderBottom={"1px solid #34383b"}
          >
            {title}
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
                value={searchValue}
                border={"none"}
                background={"transparent"}
                color={"white"}
                placeholder={"Search"}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <SearchIcon />
            </Flex>
            <Flex
              alignCenter
              gridGap={"8px"}
              background={"#0005"}
              p={"8px 16px"}
              border={"1px solid #34383b"}
              borderRadius={"8px"}
              fontSize={"13.3px"}
              cursor={"pointer"}
              onClick={() => setActiveFilter(!activeFilter)}
            >
              <FilterIcon />
              filter
              <IconNarrow dir={activeFilter ? "up" : "down"} />
            </Flex>
          </Flex>

          {activeFilter && (
            <Flex gridGap={"16px"} flexWrap={"wrap"}>
              <FilterItem
                title={"Management Fee"}
                min={managementFeeMin}
                setMin={setMmanagementFeeMin}
                max={managementFeeMax}
                setMax={setMmanagementFeeMax}
              />
              <FilterItem
                title={"Founded"}
                isDate
                min={foundedMin}
                setMin={setFoundedMin}
                max={foundedMax}
                setMax={setFoundedMax}
              />
            </Flex>
          )}
          <Flex
            col
            gridGap={"16px"}
            background={"#302d38"}
            p={"20px"}
            border={"1px solid #34383b"}
            borderRadius={"10px"}
            height={"480px"}
            overflow={"auto"}
          >
            <Table width={"100%"} textAlign={"left"}>
              <Thead>
                <Tr>
                  <Th>
                    <SortBtn
                      value={"poolName"}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Index Name
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={"-"}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      TVL
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={"-"}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      YTD %
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={"founded"}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Founded
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={"managementFee"}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Management Fee
                    </SortBtn>
                  </Th>
                  <Th>
                    <SortBtn
                      value={"No"}
                      sortDir={sortDir}
                      setSortValue={setSortValue}
                      sortValue={sortValue}
                      setSortDir={setSortDir}
                    >
                      Locked
                    </SortBtn>
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {miraIndexes
                  .sort(
                    (a: any, b: any) =>
                      (a[sortValue]?.toString() > b[sortValue]?.toString()
                        ? 1
                        : -1) * (sortDir ? -1 : 1)
                  )
                  .map((miraIndex, index) => {
                    let flag = false;
                    for (const key in miraIndex) {
                      if (
                        miraIndex[key] &&
                        searchValue &&
                        miraIndex[key]
                          .toUpperCase()
                          .search(searchValue.toUpperCase()) != -1
                      ) {
                        flag = true;
                        break;
                      }
                    }
                    if (activeFilter) {
                      if (
                        managementFeeMin &&
                        parseInt(managementFeeMin) >
                          parseInt(miraIndex.managementFee)
                      )
                        return "";
                      if (
                        managementFeeMax &&
                        parseInt(managementFeeMax) <
                          parseInt(miraIndex.managementFee)
                      )
                        return "";
                      if (
                        foundedMin &&
                        new Date(foundedMin) > new Date(miraIndex.founded)
                      )
                        return "";
                      if (
                        foundedMax &&
                        new Date(foundedMax) < new Date(miraIndex.founded)
                      )
                        return "";
                    }
                    return searchValue && !flag ? (
                      ""
                    ) : (
                      <Tr key={index}>
                        <Td>
                          <Flex
                            alignCenter
                            gridGap={"10px"}
                            cursor={"pointer"}
                            onClick={() => {
                              navigate(
                                "/otherprofile",
                                {
                                  state: {
                                    username: miraIndex.poolName
                                  }
                                }
                              );
                            }}
                          >
                            <Box
                              background={
                                "linear-gradient(90deg,#fceabb,#f8b500)"
                              }
                              borderRadius={"100%"}
                              width={"25px"}
                              height={"25px"}
                            ></Box>
                            {miraIndex.poolName}
                          </Flex>
                        </Td>
                        <Td
                          cursor={"pointer"}
                          onClick={() => {
                            setVisiblePortfolio(true);
                          }}
                        >-</Td>
                        <Td
                          cursor={"pointer"}
                          onClick={() => {
                            setVisiblePortfolio(true);
                          }}
                        >-%</Td>
                        <Td
                          cursor={"pointer"}
                          onClick={() => {
                            setVisiblePortfolio(true);
                          }}
                        >{miraIndex.founded}</Td>
                        <Td
                          cursor={"pointer"}
                          onClick={() => {
                            setVisiblePortfolio(true);
                          }}
                        >{miraIndex.managementFee}%</Td>
                        <Td
                          cursor={"pointer"}
                          onClick={() => {
                            setVisiblePortfolio(true);
                          }}
                        >No</Td>
                        <Td>
                          <Flex
                            justifyCenter
                            padding={"4px 8px"}
                            background={"#0005"}
                            border={"1px solid #34383b"}
                            borderRadius={"4px"}
                            cursor={"pointer"}
                          >
                            start with this
                          </Flex>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export const SortBtn: React.FC<{
  value: string;
  sortDir: any;
  setSortValue?: (arg: any) => void;
  sortValue: any;
  setSortDir?: (arg: any) => void;
  children: React.ReactNode;
}> = ({ value, sortDir, setSortValue, sortValue, setSortDir, children }) => {
  return (
    <Flex
      alignCenter
      justifyContent={"flex-start"}
      gridGap={"8px"}
      onClick={() => {
        setSortValue(value);
        sortValue === value && setSortDir(!sortDir);
      }}
    >
      {children}
      <SortDirIcon active={sortValue === value} isInc={sortDir} />
    </Flex>
  );
};

export const FilterItem: React.FC<{
  title: string;
  isDate?: boolean;
  min: any;
  setMin: (arg: any) => void;
  max: any;
  setMax: (arg: any) => void;
}> = ({ title, isDate, min, setMin, max, setMax }) => {
  return (
    <Flex
      col
      gridGap={"4px"}
      p={"6px 12px"}
      bg={"#302d38"}
      border={"1px solid #34383b"}
      borderRadius={"8px"}
    >
      <Flex alignCenter justifyContent={"space-between"}>
        {title}
        <Link
          p={"2px 6px"}
          bg={"#0005"}
          border={"1px solid #34383b"}
          borderRadius={"8px"}
          visibility={min || max ? "visible" : "hidden"}
          onClick={() => {
            setMax("");
            setMin("");
          }}
        >
          &times;
        </Link>
      </Flex>
      <Flex alignCenter gridGap={"8px"}>
        <Flex>
          <Input
            type={isDate ? "date" : "number"}
            placeholder="min"
            value={min}
            bg={"#0005"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            color={"white"}
            p={"6px 12px"}
            width={"100px"}
            onChange={(e) => setMin(e.target.value)}
          />
        </Flex>
        <Flex>to</Flex>
        <Flex>
          <Input
            type={isDate ? "date" : "number"}
            placeholder="max"
            value={max}
            bg={"#0005"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            color={"white"}
            p={"6px 12px"}
            width={"100px"}
            onChange={(e) => setMax(e.target.value)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const ModifyModalBody: React.FC<{ [index: string]: any }> = ({
  miraIndexInfo = {},
  setVisible = () => {},
  setUpdateVisible = () => {},
  setAllocationVisible = () => {},
  allocationData = [],
  ...props
}) => {
  const { walletConnected, walletAddress } = useWalletHook();
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setHovered] = React.useState(false);
  const [isReal, setRealAlloc] = React.useState(true);

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
        {`${(percent * 100).toFixed(0)}%`}
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
      const sum = allocationData.reduce((a, v) => (a = a + v.value), 0);

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
          {visibleDeposit && <DepositModalBody />}
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
              Modify My Index
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
              <Flex col flex={3} width={"0px"} p={"20px"} aspectRatio={"2"}>
                <ResponsiveContainer>
                  {allocationData && Array.isArray(allocationData) && (
                    <PieChart
                      width={300}
                      height={300}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAllocationVisible(true);
                      }}
                    >
                      <Tooltip content={<CustomizedTooltip />} />
                      <Pie
                        activeIndex={isHovered ? activeIndex : null}
                        activeShape={renderActiveShape}
                        data={allocationData}
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
                        {allocationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </ResponsiveContainer>
                <div>
                  <Flex
                    mt={"1em"}
                    fontSize={"15px"}
                    alignCenter
                    justifyContent={"space-around"}
                  >
                    <Flex
                      cursor={"pointer"}
                      onClick={() => setRealAlloc(true)}
                      color={isReal ? "#d15151" : "#fafafa"}
                    >
                      Strategy Allocation
                    </Flex>
                    <Link
                      m={"auto 0px"}
                      fontSize={"2em"}
                      transform={"rotate(90deg)"}
                    >
                      <ExchangeIcon />
                    </Link>
                    <Flex
                      cursor={"pointer"}
                      onClick={() => setRealAlloc(false)}
                      color={!isReal ? "#d15151" : "#fafafa"}
                    >
                      Real Allocation
                    </Flex>
                    <Flex cursor={"pointer"}>
                      <CustomTooltip
                        title="changes the portfolio above from viewing the strategy to the current allocation"
                        arrow
                        disableInteractive
                        placement="top"
                      >
                        <span>ⓘ</span>
                      </CustomTooltip>
                    </Flex>
                  </Flex>
                </div>
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
          <UpdateSection
            setVisibleDeposit={setVisibleDeposit}
            setVisibleWithdraw={setVisibleWithdraw}
            setUpdateVisible={setUpdateVisible}
          />
        </Flex>
      )}
    </>
  );
};

type UpdateSectionProps = {
  setVisibleDeposit: (arg: boolean) => void;
  setVisibleWithdraw: (arg: boolean) => void;
  setUpdateVisible: (arg: boolean) => void;
};
const UpdateSection: React.FC<UpdateSectionProps> = ({
  setVisibleDeposit,
  setVisibleWithdraw,
  setUpdateVisible,
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
      <Flex fontFamily={"art"} fontSize={"20px"} fontWeight={"bold"}>
        Update
      </Flex>
      <Flex
        mt={"1em"}
        fontSize={"16px"}
        alignCenter
        justifyContent={"space-around"}
      >
        <ArtButton
          mt={"24px"}
          mx={"auto"}
          minWidth={"150px"}
          padding={"12px 24px"}
          textAlign={"center"}
          onClick={() => {
            setUpdateVisible(true);
          }}
        >
          Change Settings
        </ArtButton>
      </Flex>
      <Flex
        mt={"1em"}
        fontSize={"16px"}
        alignCenter
        justifyContent={"space-around"}
      >
        <ArtButton
          mt={"24px"}
          mx={"auto"}
          minWidth={"150px"}
          padding={"12px 24px"}
          textAlign={"center"}
        >
          Rebalance Now
        </ArtButton>
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
          Add Funds
        </Flex>
        <Link m={"auto 0px"} fontSize={"2em"} transform={"rotate(90deg)"}>
          <ExchangeIcon />
        </Link>
        <Flex
          cursor={"pointer"}
          onClick={() => setInvest(false)}
          color={!isInvest ? "#d15151" : "#fafafa"}
        >
          Remove Funds
        </Flex>
      </Flex>
      <AddRemoveBox />

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
          {isInvest ? "ADD" : "REMOVE"}
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

const AddRemoveBox = () => {
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
