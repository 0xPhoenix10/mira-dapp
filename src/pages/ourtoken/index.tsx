import { useState } from "react";
import { Box, Link, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { ChartBox } from "pages/components";
import { Flex } from "components/base/container";
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
import { CustomSelect, SmOption } from "components/form";
import { ArrowIcon, ExchangeIcon } from "components/icons";
import { ArtButton, NormalBtn } from "components/elements/buttons";
import { useWalletHook } from "common/hooks/wallet";

const OurTokenPage: React.FC = () => {
  const data1 = [
    { name: "APT", value: 100 },
    { name: "ETH", value: 100 },
    { name: "BTC", value: 100 },
    { name: "DOT", value: 100 },
  ];
  const COLORS = [
    "#97acd0",
    "#5c87bf",
    "#4a7ab2",
    "#4470a5",
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
        {`${data1[index].name}`}
      </text>
    );
  };
  const data2 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      {currentTab === 1 ? (
        <Flex py={"20px"} width={"100%"} gridGap={"16px"}>
          <Flex flex={1} col>
            <NormalBtn onClick={() => setCurrentTab(0)}>
              <ArrowIcon dir={"left"} />
              back
            </NormalBtn>
            <Flex
              mt={"4px"}
              fontFamily={"art"}
              fontSize={"20px"}
              fontWeight={"bold"}
              px={"10px"}
              pb={"6px"}
              borderBottom={"1px solid #34383b"}
            >
              BROAD EXPOSURE INDEX (BEI)
              <Flex
                ml={"auto"}
                mt={"auto"}
                fontSize={"16px"}
                fontWeight={"normal"}
                gridGap={"16px"}
              >
                <Flex>48.29</Flex>/<Flex>4.1%</Flex>
              </Flex>
            </Flex>
            <Flex p={"20px"}>
              <Flex flex={3} width={"0px"} p={"20px"} aspectRatio={"2"}>
                <ResponsiveContainer>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={data1}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={"100%"}
                      fill="#8884d8"
                      stroke={"transparent"}
                      dataKey="value"
                    >
                      {data1.map((entry, index) => (
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
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                    <Line
                      type="monotone"
                      dataKey="pv"
                      stroke="#8884d8"
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
          <SwapSection />
        </Flex>
      ) : (
        <Box
          py={"20px"}
          display={"grid"}
          gridTemplateColumns={"auto auto auto"}
          justifyItems={"center"}
          alignItems={"center"}
          gridGap={"18px"}
          width={"100%"}
        >
          <ChartBox
            width={"100%"}
            title={"Aptos Defi Pulse"}
            cursorAll={"pointer"}
            onClickAll={() => {
              setCurrentTab(1);
            }}
          />
          <ChartBox
            width={"100%"}
            title={"Aptos Defi Pulse"}
            cursorAll={"pointer"}
            onClickAll={() => {
              setCurrentTab(1);
            }}
          />
          <ChartBox
            width={"100%"}
            title={"Aptos Defi Pulse"}
            cursorAll={"pointer"}
            onClickAll={() => {
              setCurrentTab(1);
            }}
          />
          <ChartBox
            width={"100%"}
            title={"Aptos Defi Pulse"}
            cursorAll={"pointer"}
            onClickAll={() => {
              setCurrentTab(1);
            }}
          />
          <ChartBox
            width={"100%"}
            title={"Aptos Defi Pulse"}
            cursorAll={"pointer"}
            onClickAll={() => {
              setCurrentTab(1);
            }}
          />
          <ChartBox
            width={"100%"}
            title={"Aptos Defi Pulse"}
            cursorAll={"pointer"}
            onClickAll={() => {
              setCurrentTab(1);
            }}
          />
        </Box>
      )}
    </>
  );
};

const SwapSection = () => {
  const { walletConnected } = useWalletHook();
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
        fontSize={"18px"}
        fontWeight={"bold"}
      >
        Update
      </Flex>
      <Flex mt={"1em"} fontSize={"16px"}>
        From
      </Flex>
      <SwapBox />
      <Link
        mx={"auto"}
        fontSize={"2em"}
        p={"12px"}
        border={"1px dashed #fff3"}
        borderRadius={"20px"}
      >
        <ExchangeIcon />
      </Link>
      <Flex mt={"-2em"} fontSize={"16px"}>
        To
      </Flex>
      <SwapBox />
      {walletConnected ? (
        <ArtButton
          mt={"24px"}
          mx={"auto"}
          minWidth={"150px"}
          padding={"12px 24px"}
          textAlign={"center"}
        >
          Swap
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

const SwapBox = () => {
  return (
    <Flex
      col
      gridGap={"12px"}
      background={"#0005"}
      width={"300px"}
      p={"12px 24px"}
      border={"1px dashed #fff3"}
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
            <SmOption value={"BEI"}>BEI</SmOption>
          </CustomSelect>
        </Flex>
      </Flex>
      <Flex alignCenter justifyContent={"flex-end"} gridGap={"8px"}>
        <Flex>Balance :</Flex>
        <Flex>10</Flex>
        <Link ml={"8px"} p={"4px 8px"} bg={"#0005"} borderRadius={"4px"}>
          Max
        </Link>
      </Flex>
    </Flex>
  );
};

export default OurTokenPage;
