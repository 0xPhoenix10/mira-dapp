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
import { FEE_DECIMAL, MODULE_ADDR } from "../config";
import { useWalletHook } from "../common/hooks/wallet";
import { UpdateIndexProviderContext } from "./dashboard";
import { PortfolioModalBody } from "./dashboard/portfolio.modal.body";
import DepositModalBody from "./dashboard/deposit.modal.body";
import WithdrawModalBody from "./dashboard/withdraw.modal.body";
import { renderActiveShape } from "../common/recharts/piechart";
import { ArtButton, NormalBtn } from "components/elements/buttons";

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
        <Flex col gridGap={"4px"} color={"lightgrey"} cursor={"pointer"}>
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

export const IndexListModalBody: React.FC<{ [index: string]: any }> = ({
  title = "???",
  ...props
}) => {
  const [visiblePortfolio, setVisiblePortfolio] = useState(false);
  return (
    <>
      {visiblePortfolio ? (
        <>
          <Flex
            background={"#0005"}
            p={"8px 16px"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            ml={"auto"}
            mb={"-30px"}
            cursor="pointer"
            onClick={() => {
              setVisiblePortfolio(false);
            }}
            zIndex={"0"}
          >
            <ArrowIcon dir={"left"} />
          </Flex>
          <PortfolioModalBody />
        </>
      ) : (
        <Flex col gridGap={"10px"}>
          <Flex
            alignCenter
            py={"8px"}
            fontSize={"18px"}
            fontWeight={"500"}
            borderBottom={"1px solid #34383b"}
          >
            {title}
            {/* Recommended */}
            {/* Leaderboard */}
            {/* My Indexes */}
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
                  <Th>TVL</Th>
                  <Th>YTD %</Th>
                  <Th>Founded</Th>
                  <Th>Management Fee</Th>
                  <Th>Locked</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array(10)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <Tr key={index}>
                        <Td>
                          <Flex
                            alignCenter
                            gridGap={"10px"}
                            cursor={"pointer"}
                            onClick={() => {
                              setVisiblePortfolio(true);
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
                            Index 1
                          </Flex>
                        </Td>
                        <Td>2ook</Td>
                        <Td>20.2%</Td>
                        <Td>Dec 1, 2000</Td>
                        <Td>0.75%</Td>
                        <Td>No</Td>
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

export const ModifyModalBody: React.FC<{ [index: string]: any }> = ({
  miraIndexInfo = {},
  setVisible = () => {},
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
              <Flex flex={3} width={"0px"} p={"20px"} aspectRatio={"2"}>
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
          />
        </Flex>
      )}
    </>
  );
};

type UpdateSectionProps = {
  setVisibleDeposit: (arg: boolean) => void;
  setVisibleWithdraw: (arg: boolean) => void;
};
const UpdateSection: React.FC<UpdateSectionProps> = ({
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
