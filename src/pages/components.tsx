import { Box, Input, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { Flex } from "components/base/container";
import { CustomSelect, RadioBtn, SmOption } from "components/form";
import {
  ArrowIcon,
  CheckIcon,
  CreateIcon,
  SearchIcon,
  TimesIcon,
} from "components/icons";
import React, { useContext, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FEE_DECIMAL, MODULE_ADDR } from "../config";
import { useWalletHook } from "../common/hooks/wallet";
import { UpdateIndexProviderContext } from "./dashboard";
import { PortfolioModalBody } from "./dashboard/portfolio.modal.body";
import DepositModalBody from "./dashboard/deposit.modal.body";
import WithdrawModalBody from "./dashboard/withdraw.modal.body";

interface ChartBoxProps {
  title?: string;
  [index: string]: any;
}
export const ChartBox: React.FC<ChartBoxProps> = ({
  title = "Chart Box",
  cursor = "revert",
  onClick = () => { },
  cursorAll,
  onClickAll = () => { },
  ...props
}) => {
  const data = [
    { name: "APT", value: 100 },
    { name: "ETH", value: 100 },
    { name: "BTC", value: 100 },
    { name: "DOT", value: 100 },
  ];
  const COLORS = ["#97acd0", "#5c87bf", "#4a7ab2", "#4470a5", "#3d6595", "#345882"]

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
  return (
    <Flex
      col
      background={"#101012"}
      p={"20px"}
      border={"1px solid #34383b"}
      borderRadius={"20px"}
      gridGap={"12px"}
      {...props}
    >
      <Flex justifyCenter alignCenter gridGap={"16px"} cursor={cursorAll} onClick={onClickAll}>
        <Flex width={"40%"} aspectRatio={"1"}>
          <ResponsiveContainer>
            <PieChart width={300} height={300} onClick={onClick} style={{ cursor: cursor }}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Flex>
        <Flex col gridGap={"4px"}>
          <Flex mb={"8px"} fontSize={"18px"} fontWeight={"bold"} mx={"auto"}>
            Mira
          </Flex>
          <Flex gridGap={"8px"}>
            <Box>1d</Box>
            <Box>:</Box>
            <Box>0.2%</Box>
          </Flex>
          <Flex gridGap={"8px"}>
            <Box>1w</Box>
            <Box>:</Box>
            <Box>4.1%</Box>
          </Flex>
          <Flex gridGap={"8px"}>
            <Box>1y</Box>
            <Box>:</Box>
            <Box>18.5%</Box>
          </Flex>
          <Flex gridGap={"8px"}>
            <Box>Ratio</Box>
            <Box>:</Box>
            <Box>0.23</Box>
          </Flex>
          <Flex gridGap={"8px"}>
            <Box>TVL</Box>
            <Box>:</Box>
            <Box>3.2M</Box>
          </Flex>
          <Flex gridGap={"8px"}>
            <Box>Expert</Box>
            <Box>:</Box>
            <Box>✓</Box>
          </Flex>
        </Flex>
      </Flex>
      <Box fontSize={"16px"} fontWeight={"bold"} opacity={"0.3"}>
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
  setVisible = () => { },
  setAllocationVisible = () => { },
  allocationData,
  ...props
}) => {
  const { walletConnected, signAndSubmitTransaction } = useWalletHook();
  const [nameValue, setNameValue] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [managementFee, setManagementFee] = useState<number>(0);
  const [rebalancingPeriod, setRebalancingPeriod] = useState<number>(0);
  const [minimumContribution, setMiniumContribution] = useState<number>(0);
  const [miniumWithdrawal, setMiniumWithdrawal] = useState<number>(0);
  const [privateAllocation, setPrivateAlloation] = useState<boolean>(false);
  const [referralReward, setReferralReward] = useState<number>(0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

  const { updateIndex, setUpdateIndex } = useContext(UpdateIndexProviderContext);

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
      type: 'entry_function_payload',
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
        private_allocation
      ]
    };
    console.log(transaction);
    const result = await signAndSubmitTransaction(transaction);
    if (result) {
      setUpdateIndex(!updateIndex);
      setVisible(false);
    }
  }
  return (
    <>
      {(visibleDeposit || visibleWithdraw) ? (
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
          <Flex py={"8px"} fontSize={"18px"} fontWeight={"500"} borderBottom={"1px solid #34383b"}>
            {type === "modify" && "Modify My Index"}
            {type === "create" && "Create My Index"}
          </Flex>
          <Flex justifyCenter gridGap={"16px"}>
            <Flex
              col
              background={"#101012"}
              p={"20px"}
              border={"1px solid #34383b"}
              borderRadius={"20px"}
              gridGap={"12px"}
              {...props}
            >
              <Flex justifyCenter gridGap={"16px"}>
                {(type === "modify" || type === "create") &&
                  <Flex col>
                    <Flex width={"200px"} aspectRatio={"1"}>
                      <ResponsiveContainer>
                        <PieChart
                          width={300}
                          height={300}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            // if (type === "modify") setVisibleAllocation(true);
                            setAllocationVisible(true);
                          }}
                        >
                          <Pie
                            data={allocationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={"100%"}
                            fill="#8884d8"
                            stroke={"transparent"}
                            dataKey="value"
                          >
                            {allocationData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % 4]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                    </Flex>
                    {(type === "modify") && (
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
                }
                <Flex col gridGap={"4px"}>
                  <Table>
                    <Tbody>
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Name :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                            <Input
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              readOnly={type === "modify"}
                              onChange={(e) => {
                                setNameValue(e.target.value)
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
                          <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
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
                                setTotalAmount(parseInt(e.target.value))
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
                          <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
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
                                setManagementFee(parseInt(e.target.value))
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
                            <CustomSelect flex={"1"} onChange={(e: number) => {
                              setRebalancingPeriod(e)
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
                      <Tr>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          Minimum Contribution :
                        </Td>
                        <Td px={"4px"} py={"2px"} borderBottom={"none"}>
                          <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                            <Input
                              flex={"1"}
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              readOnly={type === "modify"}
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
                            <CustomSelect flex={"1"}
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
                          <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                            <Input
                              flex={"1"}
                              border={"none"}
                              background={"transparent"}
                              color={"white"}
                              placeholder={"input here..."}
                              readOnly={type === "modify"}
                              onChange={(e) => {
                                setReferralReward(parseInt(e.target.value))
                              }}
                            />
                            %
                          </Flex>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Flex>
              </Flex>
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
                              background={"linear-gradient(90deg,#fceabb,#f8b500)"}
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


