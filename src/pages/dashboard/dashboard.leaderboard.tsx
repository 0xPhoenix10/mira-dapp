import { useWalletHook } from "common/hooks/wallet";
import { Box, Input, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { CustomTooltip } from "components/elements/tooptip";
import { Flex } from "components/base/container";
import { FilterIcon, IconNarrow, SearchIcon } from "components/icons";
import { ModalParent } from "components/modal";
import { useNavigate } from "react-router-dom";
import { FilterItem, IndexListModalBody, SortBtn } from "pages/components";
import { useEffect, useState, useContext } from "react";
import { MODULE_ADDR, NODE_URL } from "config";
import { AptosClient } from "aptos";
import { getFormatedDate, getStringFee } from "../../utils";
import DepositModalBody from "./deposit.modal.body";
import WithdrawModalBody from "./withdraw.modal.body";
import { UpdateIndexProviderContext } from "./index";
import { PortfolioModalBody } from "./portfolio.modal.body";

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
  const navigate = useNavigate();

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
    if (!walletConnected) return;
    try {
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
    } catch (error) {
      console.log("set mira indexes error", error);
    }
  };

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
    setSearchValue(window.localStorage.getItem("searchValue"));
    setSortDir(window.localStorage.getItem("sortDir") === "true");
    setSortValue(window.localStorage.getItem("sortValue"));
    setActiveFilter(window.localStorage.getItem("activeFilter") === "true");
    setMmanagementFeeMin(window.localStorage.getItem("managementFeeMin"));
    setMmanagementFeeMax(window.localStorage.getItem("managementFeeMax"));
    setFoundedMin(window.localStorage.getItem("foundedMin"));
    setFoundedMax(window.localStorage.getItem("foundedMax"));
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("searchValue", searchValue);
    window.localStorage.setItem("sortDir", sortDir ? "true" : "false");
    window.localStorage.setItem("sortValue", sortValue);
    window.localStorage.setItem(
      "activeFilter",
      activeFilter ? "true" : "false"
    );
    window.localStorage.setItem("managementFeeMin", managementFeeMin);
    window.localStorage.setItem("managementFeeMax", managementFeeMax);
    window.localStorage.setItem("foundedMin", foundedMin);
    window.localStorage.setItem("foundedMax", foundedMax);
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
            gridGap={"8px"}
            background={"#302d38"}
            px={"18px"}
            py={"10px"}
            border={"1px solid #34383b"}
            borderRadius={"8px"}
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
          background={"#302D38"}
          p={"20px"}
          border={"1px solid #34383b"}
          borderRadius={"20px"}
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
                    <CustomTooltip
                      title="Total Value Locked measures the total amount of funds deposited"
                      arrow
                      disableInteractive
                      placement="top"
                    >
                      <span>TVL ⓘ</span>
                    </CustomTooltip>
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
                    <CustomTooltip
                      title="market performance from the beginning of the year -> today"
                      arrow
                      disableInteractive
                      placement="top"
                    >
                      <span>Founded ⓘ</span>
                    </CustomTooltip>
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
                    <CustomTooltip
                      title="percentage of each deposit that the manager collects as a fee for managing the investments"
                      arrow
                      disableInteractive
                      placement="top"
                    >
                      <span>Management Fee ⓘ</span>
                    </CustomTooltip>
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
                    <CustomTooltip
                      title="The lockup period before a user can withdraw funds they have deposited"
                      arrow
                      disableInteractive
                      placement="top"
                    >
                      <span>Locked ⓘ</span>
                    </CustomTooltip>
                  </SortBtn>
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
                .sort(
                  (a: any, b: any) =>
                    (a[sortValue]?.toString().toUpperCase() >
                    b[sortValue]?.toString().toUpperCase()
                      ? 1
                      : -1) * (sortDir ? -1 : 1)
                )
                .map((miraIndex, index) => {
                  let flag = false;
                  for (const key in miraIndex) {
                    if (
                      miraIndex[key]
                        .toString()
                        .toUpperCase()
                        .search(searchValue.toUpperCase()) != -1
                    ) {
                      flag = true;
                      break;
                    } else continue;
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
                                  username: miraIndex.poolName,
                                  owner: miraIndex.poolOwner
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
                          />
                          {miraIndex.poolName}
                        </Flex>
                      </Td>
                      <Td 
                        cursor={"pointer"}
                        onClick={() => {
                          setPortfolioModalVisible(true);
                        }}
                      >-</Td>
                      <Td
                        cursor={"pointer"} 
                        onClick={() => {
                          setPortfolioModalVisible(true);
                        }}
                      >-%</Td>
                      <Td 
                        cursor={"pointer"}
                        onClick={() => {
                          setPortfolioModalVisible(true);
                        }}
                      >{miraIndex.founded}</Td>
                      {/*<Td>Dec 1, 2000</Td>*/}
                      <Td 
                        cursor={"pointer"}
                        onClick={() => {
                          setPortfolioModalVisible(true);
                        }}
                      >{miraIndex.managementFee}%</Td>
                      <Td 
                        cursor={"pointer"}
                        onClick={() => {
                          setPortfolioModalVisible(true);
                        }}
                      >No</Td>
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
