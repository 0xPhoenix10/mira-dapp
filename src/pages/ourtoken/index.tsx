import React, { useEffect, useState } from "react";
import { Box, Link, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { ChartBox, BuySellSection } from "pages/components";
import { Flex } from "components/base/container";
import DepositModalBody from "../dashboard/deposit.modal.body";
import WithdrawModalBody from "../dashboard/withdraw.modal.body";

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
import { CustomSelect, SmOption } from "components/form";
import { ArrowIcon, ExchangeIcon } from "components/icons";
import { ArtButton, NormalBtn, AddBtn } from "components/elements/buttons";
import { useWalletHook } from "common/hooks/wallet";
import { renderActiveShape } from "../../common/recharts/piechart";
import { ModalParent } from "components/modal";
import { ProfileModalBody } from "../otherprofile";

import { BsInfoCircle } from "react-icons/bs";
import "./ourtoken.css";
interface IData {
  name: string;
  value: string | number;
}

const OurTokenPage: React.FC = () => {
  const firstModalFlag = localStorage.getItem('sawFirstModal');
  const [showPortfolio, setPortfolioModal] = useState<boolean>(false);
  const [portfolioTitle, setTitle] = useState("???");
  const [profile, setProfile] = useState({});
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [showStartup, setStartupModalVisible] = useState(firstModalFlag === "true" ? false : true);

  return (
    <>
      <Box
        py={"20px"}
        px={"32px"}
        display={"grid"}
        gridTemplateColumns={"auto auto auto"}
        justifyItems={"center"}
        alignItems={"center"}
        gridGap={"18px"}
        width={"100%"}
      >
        <ChartBox
          width={"100%"}
          title={"xHack Startup Index"}
          cursorAll={"pointer"}
          onClickPieChart={() => {
            setPortfolioModal(true);
            setTitle("xHack Startup Index");
          }}
          onClickTitle={() => {
            setProfile({
              username: 'Mira',
              owner: '0x',
            });
            setProfileModalVisible(true);
          }}
        />
        <ChartBox
          width={"100%"}
          title={"L1 Exposure Index"}
          cursorAll={"pointer"}
          onClickPieChart={() => {
            setPortfolioModal(true);
            setTitle("L1 Exposure Index");
          }}
          onClickTitle={() => {
            setProfile({
              username: 'Mira',
              owner: '0x',
            });
            setProfileModalVisible(true);
          }}
        />
        <ChartBox
          width={"100%"}
          title={"Broad DeFi Index"}
          cursorAll={"pointer"}
          onClickPieChart={() => {
            setPortfolioModal(true);
            setTitle("Broad DeFi Index");
          }}
          onClickTitle={() => {
            setProfile({
              username: 'Mira',
              owner: '0x',
            });
            setProfileModalVisible(true);
          }}
        />
        <ChartBox
          width={"100%"}
          title={"Broad Wireless Index"}
          cursorAll={"pointer"}
          onClickPieChart={() => {
            setPortfolioModal(true);
            setTitle("Broad Wireless Index");
          }}
          onClickTitle={() => {
            setProfile({
              username: 'Mira',
              owner: '0x',
            });
            setProfileModalVisible(true);
          }}
        />
        <ChartBox
          width={"100%"}
          title={"Broad Web3 Index"}
          cursorAll={"pointer"}
          onClickPieChart={() => {
            setPortfolioModal(true);
            setTitle("Broad Web3 Index");
          }}
          onClickTitle={() => {
            setProfile({
              username: 'Mira',
              owner: '0x',
            });
            setProfileModalVisible(true);
          }}
        />
        <ChartBox
          width={"100%"}
          title={"Broad Gaming Index"}
          cursorAll={"pointer"}
          onClickPieChart={() => {
            setPortfolioModal(true);
            setTitle("Broad Gaming Index");
          }}
          onClickTitle={() => {
            setProfile({
              username: 'Mira',
              owner: '0x',
            });
            setProfileModalVisible(true);
          }}
        />
      </Box>
      {
        <ModalParent
          visible={showPortfolio}
          setVisible={setPortfolioModal}
        >
          <PortfolioModalBody
            flex={1}
            title={portfolioTitle}
            setVisible={showPortfolio}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={profileModalVisible}
          setVisible={setProfileModalVisible}
        >
          <ProfileModalBody
            flex={1}
            setVisible={setProfileModalVisible}
            profile={profile}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={showStartup}
          setVisible={setStartupModalVisible}
        >
          <StartupModalBody
            flex={1}
            setVisible={setStartupModalVisible}
          />
        </ModalParent>
      }
    </>
  );
};

const PortfolioModalBody: React.FC<{ [index: string]: any }> = ({
  title = "???",
  setVisible = () => { },
  miraIndexInfo = {},
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setHovered] = useState(false);
  const [isMore, setMoreBtn] = useState(false)
  const [visibleDeposit, setVisibleDeposit] = useState(false);
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);
  const [dataRange, setDataRange] = useState("1D");
  const [chartData, setChartData] = useState([]);

  const data1 = [
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

  const style = {
    backgroundColor: "lightgrey",
    color: "black",
    padding: "2px 20px",
    fontSize: "12px",
  };

  const CustomizedTooltip = React.memo((props: any) => {
    if (props.payload.length > 0) {
      const sum = data1.reduce((a, v) => (a = a + v.value), 0);

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
  useEffect(() => {
    getChartData();
  }, [dataRange]);
  const getChartData = () => {
    var arrTmp = [];
    for (var i = 0; i < 7; i++) {
      if (dataRange == "3D" && i > 2) {
        continue;
      }
      var m = "";
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
              setVisible={setVisibleDeposit}
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
              xHack Startup Index (XSI)
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
                      data={data1}
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
                  {isMore && (
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
                  )}
                  {!isMore && (
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
                    onClick={() => isMore ? setMoreBtn(false) : setMoreBtn(true)}
                  >
                    {isMore ? "-" : "+"}
                  </AddBtn>
                </Flex>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}
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
          {/* <SwapSection /> */}
        </Flex>
      )}
    </>
  );
};

const StartupModalBody: React.FC<{ [index: string]: any }> = ({
  title = "???",
  setVisible = () => { },
  ...props
}) => {
  localStorage.setItem('sawFirstModal', "true");

  return (
    <Flex py={"20px"} width={"100%"} gridGap={"16px"} className={"ourTokenContainer"}>
      <Flex flex={1} col>
        {/* <Flex
          mt={"4px"}
          fontFamily={"art"}
          fontSize={"20px"}
          fontWeight={"bold"}
          px={"10px"}
          pb={"6px"}
          borderBottom={"1px solid #34383b"}
        >
          xHack Startup Index (XSI)
        </Flex> */}
        <Flex p={"20px"} className={"tokenBody"}>
          <Flex
            flex={5}
            p={"20px"}
            fontFamily={"art"}
            fontSize={"18px"}
            fontWeight={"600"}
            letterSpacing={"0.1em"}
            aspectRatio={"8"}
            width={"0px"}
            alignCenter
            className={"tokenContent"}
          >
            <Flex
              flex={5}
              p={"20px"}
              fontFamily={"art"}
              fontSize={"60px"}
              fontWeight={"600"}
              letterSpacing={"0.1em"}
              className={"infoIcon"}
            ><BsInfoCircle /></Flex>
            <Flex>Thanks for checking out our Beta app. Keep in mind, this is a rough version of our product. We work hard and move fast, so you'll probably encounter some bugs. Bear with us while we iron them out.</Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const SwapSection = () => {
  const { walletConnected, openConnectModal } = useWalletHook();
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
        Swap
      </Flex>
      <Flex mt={"1em"} fontSize={"16px"}>
        From
      </Flex>
      <SwapBox />
      <Link
        mx={"auto"}
        fontSize={"2em"}
        p={"12px"}
        border={"1px solid #fff3"}
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
          onClick={() => openConnectModal()}
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
            <SmOption value={"APTOS"} selected>APTOS</SmOption>
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

export default OurTokenPage;
