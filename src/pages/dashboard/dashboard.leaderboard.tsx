import { useWalletHook } from "common/hooks/wallet";
import { Box, Input, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { Flex } from "components/base/container";
import { FilterIcon, SearchIcon, SortIcon } from "components/icons";
import { ModalParent } from "components/modal";
import { IndexListModalBody, PortfolioModalBody } from "pages/components";
import { useEffect, useState } from "react";

const DashboardLeaderBoard = () => {
  const { walletConnected } = useWalletHook();

  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [leaderboardMmodalVisible, setLeaderboardModalVisible] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    !walletConnected && setCurrentTab(0);
  }, [walletConnected]);

  return (
    <>
      {
        <ModalParent visible={portfolioModalVisible} setVisible={setPortfolioModalVisible}>
          <PortfolioModalBody flex={1} />
        </ModalParent>
      }

      {
        <ModalParent visible={leaderboardMmodalVisible} setVisible={setLeaderboardModalVisible}>
          <IndexListModalBody flex={1} type={"create"} title={"Leaderboard"} />
        </ModalParent>
      }

      <Flex col gridGap={"16px"} mt={"20px"}>
        <Flex
          alignCenter
          gridGap={"16px"}
          px={"10px"}
          pb={"6px"}
          borderBottom={"1px solid #34383b"}
        >
          <Flex alignItems={"flex-end"} gridGap={"8px"}>
            <Box
              fontSize={currentTab === 0 ? "20px" : "16px"}
              opacity={currentTab === 0 ? "1" : "0.5"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={() => {
                if (walletConnected && currentTab !== 0) setCurrentTab(0);
                else setLeaderboardModalVisible(true);
              }}
              transition={"100ms"}
            >
              Leaderboard
            </Box>
            {walletConnected && (
              <Box
                fontSize={currentTab === 1 ? "20px" : "16px"}
                opacity={currentTab === 1 ? "1" : "0.5"}
                fontWeight={"bold"}
                cursor={"pointer"}
                onClick={() => {
                  if (currentTab !== 1) setCurrentTab(1);
                  else setLeaderboardModalVisible(true);
                }}
                transition={"100ms"}
              >
                Friends
              </Box>
            )}
          </Flex>
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
          <Flex alignCenter gridGap={"4px"} cursor={"pointer"}>
            <FilterIcon />
            Filter
          </Flex>
          <Flex alignCenter gridGap={"4px"} cursor={"pointer"}>
            <SortIcon />
            Sort
          </Flex>
        </Flex>
        <Flex
          gridGap={"16px"}
          background={"#27282c"}
          p={"20px"}
          border={"1px solid #34383b"}
          borderRadius={"20px"}
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
                {walletConnected && <Th></Th>}
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
                            setPortfolioModalVisible(true);
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
                      {walletConnected && (
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
                      )}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </Flex>
      </Flex>
    </>
  );
};

export default DashboardLeaderBoard;
