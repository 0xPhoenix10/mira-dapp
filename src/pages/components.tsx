import { Box, Input, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { Flex } from "components/base/container";
import {
  ArrowIcon,
  CheckIcon,
  CreateIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  TimesIcon,
} from "components/icons";
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ChartBoxProps {
  title?: string;
  [index: string]: any;
}
export const ChartBox: React.FC<ChartBoxProps> = ({
  title = "Chart Box",
  cursor = "revert",
  onClick = () => {},
  cursorAll,
  onClickAll = () => {},
  ...props
}) => {
  const data = [
    { name: "APT", value: 400 },
    { name: "ETH", value: 300 },
    { name: "BTC", value: 300 },
    { name: "DOT", value: 200 },
  ];
  const COLORS = ["#395f8d", "#4d7fba", "#97acd0", "#bdc9df"];

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
      background={"#27282c"}
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
        <Flex col gridGap={"4px"} color={"#b8b9ba"}>
          <Flex mb={"8px"} fontSize={"14px"} fontStyle={"italic"} fontWeight={"bold"} mx={"auto"} color={"#74BD7B"}>
            Mira
          </Flex>
          <Flex gridGap={"8px"} >
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
      <Box fontSize={"16px"} fontWeight={"bold"} opacity={"0.7"} color={"white"}>
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
  ...props
}) => {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
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
  const [visibleAllocation, setVisibleAllocation] = useState(false);

  return (
    <>
      {visibleAllocation ? (
        <>
          <Flex
            background={"#0005"}
            p={"8px 16px"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
            ml={"auto"}
            cursor="pointer"
            onClick={() => {
              setVisibleAllocation(false);
            }}
            zIndex={"0"}
          >
            <ArrowIcon dir={"left"} />
          </Flex>
          <IndexAllocationModalBody />
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
              <Flex justifyCenter alignCenter gridGap={"16px"}>
                <Flex width={"150px"} aspectRatio={"1"}>
                  <ResponsiveContainer>
                    <PieChart
                      width={300}
                      height={300}
                      style={{ cursor: type === "modify" ? "pointer" : "revert" }}
                      onClick={() => {
                        if (type === "modify") setVisibleAllocation(true);
                      }}
                    >
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
                  <Table>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Name :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Management fee :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Rebalancing :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Minimum Contribution :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Minimum Withdrawal Period :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Public/Private Allocation :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        Referral Rewards :
                      </Td>
                      <Td px={"0px"} py={"2px"} borderBottom={"none"}>
                        <Flex alignCenter p={"4px"} borderBottom={"1px solid #34383b"}>
                          <Input
                            border={"none"}
                            background={"transparent"}
                            color={"white"}
                            placeholder={"input here..."}
                            readOnly={type === "modify"}
                          />
                        </Flex>
                      </Td>
                    </Tr>
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

export const PortfolioModalBody: React.FC<{ [index: string]: any }> = ({ ...props }) => {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
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
  return (
    <Flex col gridGap={"10px"}>
      <Flex py={"8px"} fontSize={"18px"} fontWeight={"500"} borderBottom={"1px solid #34383b"}>
        Portfolio X
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
          <Flex justifyCenter alignCenter gridGap={"16px"}>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Flex>
            <Flex col gridGap={"4px"}>
              <Flex mb={"8px"} fontSize={"16px"} fontWeight={"500"} mx={"auto"}>
                Owner: Anonymous_user123
              </Flex>
              <Flex justifyContent={"space-around"} gridGap={"8px"}>
                <Flex fontSize={"28px"} alignCenter gridGap={"4px"} color={"#49abc9"}>
                  20
                  <Box fontSize={"0.8em"} opacity={"0.8"} color={"#2a3e5b"}>
                    %
                  </Box>
                </Flex>
                <Flex fontSize={"28px"} alignCenter gridGap={"4px"} color={"#49abc9"}>
                  104
                  <Box fontSize={"0.8em"} opacity={"0.8"} color={"#2a3e5b"}>
                    K
                  </Box>
                </Flex>
              </Flex>
              <Flex maxWidth={"200px"} maxHeight={"200px"} overflow={"auto"}>
                Instead of sidebar, we can also downsize to About, Discord, and Twitter, adding all
                icons to the left of Connect Wallet Instead of sidebar, we can also downsize to
                About, Discord, and Twitter, adding all icons to the left of Connect Wallet Instead
                of sidebar, we can also downsize to About, Discord, and Twitter, adding all icons to
                the left of Connect Wallet Instead of sidebar, we can also downsize to About,
                Discord, and Twitter, adding all icons to the left of Connect Wallet Instead of
                sidebar, we can also downsize to About, Discord, and Twitter, adding all icons to
                the left of Connect Wallet Instead of sidebar, we can also downsize to About,
                Discord, and Twitter, adding all icons to the left of Connect Wallet
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

export const IndexAllocationModalBody: React.FC<{ [index: string]: any }> = ({ ...props }) => {
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
              <Th></Th>
              <Th>YTD %</Th>
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
                      <Flex cursor={"pointer"}>
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
                        Index 1
                      </Flex>
                    </Td>
                    <Td>20.2%</Td>
                    <Td>a a a a a a a a </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
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
        onClick={() => {}}
        zIndex={"0"}
      >
        <PlusIcon size={"18px"} />
        Add new Allocation
      </Flex>
    </Flex>
  );
};
