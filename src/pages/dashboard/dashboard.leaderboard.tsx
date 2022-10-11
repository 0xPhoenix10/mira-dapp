import { useWalletHook } from "common/hooks/wallet";
import { Box, Input, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { CustomTooltip } from "components/elements/tooptip";
import { Flex } from "components/base/container";
import { FilterIcon, SearchIcon, SortIcon } from "components/icons";
import { ModalParent } from "components/modal";
import { IndexListModalBody } from "pages/components";
import { useEffect, useState, useContext } from "react";
import { MODULE_ADDR, NODE_URL } from "config";
import { AptosClient } from "aptos";
import { getFormatedDate, getStringFee } from "../../utils";
import DepositModalBody from "./deposit.modal.body";
import WithdrawModalBody from "./withdraw.modal.body";
import { UpdateIndexProviderContext } from "./index";
import { PortfolioModalBody } from "./portfolio.modal.body";
import { CustomSelect, SmOption } from "components/form";

interface MiraIndex {
  poolName: string;
  poolAddress: string;
  poolOwner: string;
  managementFee: string;
  founded: string;
}

interface CreatePoolEvent {
  pool_name: string;
  pool_address: string;
  pool_owner: string;
  private_allocation: boolean;
  management_fee: number;
  founded: number;
}

const DashboardLeaderBoard = () => {
  const { walletConnected } = useWalletHook();

  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [leaderboardMmodalVisible, setLeaderboardModalVisible] =
    useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

  const [selectIndexInfo, setSelectIndexInfo] = useState<MiraIndex | null>(
    null
  );

  const [miraIndexes, setMiraIndexes] = useState<MiraIndex[]>([]);

  const { updateIndex } = useContext(UpdateIndexProviderContext);

  useEffect(() => {
    fetchIndexes();
  }, [updateIndex]);

  useEffect(() => {
    !walletConnected && setCurrentTab(0);
  }, [walletConnected]);

  const fetchIndexes = async () => {
    const client = new AptosClient(NODE_URL);
    let events = await client.getEventsByEventHandle(
      MODULE_ADDR,
      `${MODULE_ADDR}::mira::MiraStatus`,
      "create_pool_events",
      { limit: 1000 }
    );
    let create_pool_events: MiraIndex[] = [];
    for (let ev of events) {
      let e: CreatePoolEvent = ev.data;
      if (e.private_allocation) continue;
      create_pool_events.push({
        poolName: e.pool_name,
        poolAddress: e.pool_address,
        poolOwner: e.pool_owner,
        managementFee: getStringFee(e.management_fee),
        founded: getFormatedDate(e.founded),
      });
    }
    setMiraIndexes(create_pool_events);
  };

  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortValue, setSortValue] = useState("");

  return (
    <>
      {
        <ModalParent
          visible={showDepositModal}
          setVisible={setShowDepositModal}
        >
          <DepositModalBody
            flex={1}
            setVisible={setShowDepositModal}
            miraIndexInfo={selectIndexInfo}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={showWithdrawModal}
          setVisible={setShowWithdrawModal}
        >
          <WithdrawModalBody
            flex={1}
            setVisible={setShowWithdrawModal}
            miraIndexInfo={selectIndexInfo}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={portfolioModalVisible}
          setVisible={setPortfolioModalVisible}
        >
          <PortfolioModalBody flex={1} miraIndexInfo={selectIndexInfo} />
        </ModalParent>
      }

      {
        <ModalParent
          visible={leaderboardMmodalVisible}
          setVisible={setLeaderboardModalVisible}
        >
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
              fontFamily={"art"}
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
                fontFamily={"art"}
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
            background={"#302d38"}
            px={"18px"}
            py={"10px"}
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
            gridGap={"4px"}
            cursor={"pointer"}
            background={"#302d38"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
          >
            <CustomSelect
              before={
                <>
                  <FilterIcon /> Search in :{" "}
                </>
              }
              onChange={setFilterValue}
            >
              <SmOption value={"all"} selected>
                All
              </SmOption>
              <SmOption value={"poolName"}>Index Name</SmOption>
              <SmOption value={"managementFee"}>Management Fee</SmOption>
              <SmOption value={"founded"}>Founded</SmOption>
            </CustomSelect>
          </Flex>
          <Flex
            alignCenter
            gridGap={"4px"}
            cursor={"pointer"}
            background={"#302d38"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
          >
            <CustomSelect
              before={
                <>
                  <SortIcon /> Sort by :{" "}
                </>
              }
              onChange={setSortValue}
            >
              <SmOption value={"poolName"}>Index Name</SmOption>
              <SmOption value={"managementFee"}>Management Fee</SmOption>
              <SmOption value={"founded"}>Founded</SmOption>
            </CustomSelect>
          </Flex>
        </Flex>
        <Flex
          col
          gridGap={"16px"}
          background={"#302D38"}
          p={"20px"}
          border={"1px solid #34383b"}
          borderRadius={"20px"}
        >
          <Table width={"100%"} textAlign={"left"}>
            <Thead>
              <Tr>
                <Th>Index Name</Th>
                <Th>
                  <CustomTooltip
                    title="Total Value Locked measures the total amount of funds deposited"
                    arrow
                    disableInteractive
                    placement="top"
                  >
                    <span>TVL ⓘ</span>
                  </CustomTooltip>
                </Th>
                <Th>YTD %</Th>
                <Th>
                  <CustomTooltip
                    title="market performance from the beginning of the year -> today"
                    arrow
                    disableInteractive
                    placement="top"
                  >
                    <span>Founded ⓘ</span>
                  </CustomTooltip>
                </Th>
                <Th>
                  <CustomTooltip
                    title="percentage of each deposit that the manager collects as a fee for managing the investments"
                    arrow
                    disableInteractive
                    placement="top"
                  >
                    <span>Management Fee ⓘ</span>
                  </CustomTooltip>
                </Th>
                <Th>
                  <CustomTooltip
                    title="The lockup period before a user can withdraw funds they have deposited"
                    arrow
                    disableInteractive
                    placement="top"
                  >
                    <span>Locked ⓘ</span>
                  </CustomTooltip>
                </Th>
                {walletConnected && (
                  <>
                    <Th></Th>
                    <Th></Th>
                    <Th></Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {miraIndexes
                .sort((a: any, b: any) =>
                  a[sortValue]?.toString().toUpperCase() >
                  b[sortValue]?.toString().toUpperCase()
                    ? 1
                    : -1
                )
                .map((miraIndex, index) => {
                  let flag = false;
                  if (searchValue) {
                    if (filterValue === "all") {
                      for (const key in miraIndex) {
                        if (
                          miraIndex[key]
                            .toUpperCase()
                            .search(searchValue.toUpperCase()) != -1
                        ) {
                          flag = true;
                          break;
                        } else continue;
                      }
                    } else {
                      if (
                        miraIndex[filterValue]
                          .toUpperCase()
                          .search(searchValue.toUpperCase()) != -1
                      ) {
                        flag = true;
                      }
                    }
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
                            setSelectIndexInfo(miraIndex);
                            setPortfolioModalVisible(true);
                          }}
                        >
                          <Box
                            background={
                              "linear-gradient(90deg,#fceabb,#f8b500)"
                            }
                            borderRadius={"100%"}
                            width={"25px"}
                            height={"25px"}
                          />
                          {miraIndex.poolName}
                        </Flex>
                      </Td>
                      <Td>-</Td>
                      <Td>-%</Td>
                      <Td>{miraIndex.founded}</Td>
                      {/*<Td>Dec 1, 2000</Td>*/}
                      <Td>{miraIndex.managementFee}%</Td>
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
                            Share with this
                          </Flex>
                        </Td>
                      )}
                      {walletConnected && (
                        <Td>
                          <Flex
                            justifyCenter
                            padding={"4px 8px"}
                            background={"#0005"}
                            border={"1px solid #34383b"}
                            borderRadius={"4px"}
                            cursor={"pointer"}
                            onClick={() => {
                              setSelectIndexInfo(miraIndex);
                              setShowDepositModal(true);
                            }}
                          >
                            Deposit
                          </Flex>
                        </Td>
                      )}
                      {walletConnected && (
                        <Td>
                          <Flex
                            justifyCenter
                            padding={"4px 8px"}
                            background={"#0005"}
                            border={"1px solid #34383b"}
                            borderRadius={"4px"}
                            cursor={"pointer"}
                            onClick={() => {
                              setSelectIndexInfo(miraIndex);
                              setShowWithdrawModal(true);
                            }}
                          >
                            Withdraw
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
