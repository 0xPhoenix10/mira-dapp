import { useWalletHook } from "common/hooks/wallet";
import { Box } from "components/base";
import { Flex } from "components/base/container";
import { CreateIcon, WarningIcon } from "components/icons";
import { ModalParent } from "components/modal";
import { useState } from "react";
import { ChartBox, IndexListModalBody, IndexModalBody } from "../components";
import {PortfolioModalBody} from "./portfolio.modal.body";
import {IndexAllocationModalBody} from "../index.allocation.modal";
import {IndexAllocation} from "../../utils/types";


const DashboardRecommended = () => {
  const { walletConnected } = useWalletHook();
  const [createMmodalVisible, setCreateModalVisible] = useState(false);
  const [modifyMmodalVisible, setModifyModalVisible] = useState(false);
  const [recommendedModalVisible, setRecommendedModalVisible] = useState(false);
  const [myIndexesModalVisible, setMyIndexesModalVisible] = useState(false);
  const [walletConnectAlertVisible, setWalletConnectAlertVisible] = useState(false);

  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);

  const [ indexAllocationModalVisible, setIndexAllocationModalVisible] = useState(false);
  const [ allocationData, setAllocationData] = useState<IndexAllocation[]>([
      {
        name:'BTC', value:50
      },
    {
      name: 'USDT', value:50
    }
  ]);

  return (
    <>
      {
        <ModalParent visible={portfolioModalVisible} setVisible={setPortfolioModalVisible}>
          <PortfolioModalBody flex={1} />
        </ModalParent>
      }

      {
        <ModalParent visible={createMmodalVisible} setVisible={setCreateModalVisible}>
          <IndexModalBody flex={1} type={"create"} setVisible={setCreateModalVisible} setAllocationVisible = {setIndexAllocationModalVisible} allocationData = {allocationData}/>
        </ModalParent>
      }
      {
        <ModalParent visible={indexAllocationModalVisible} setVisible={setIndexAllocationModalVisible}>
          <IndexAllocationModalBody flex={1} type={"create"} allocationData={allocationData} setAllocationData={setAllocationData} setVisible={setIndexAllocationModalVisible}/>
        </ModalParent>
      }

      {
        <ModalParent visible={modifyMmodalVisible} setVisible={setModifyModalVisible}>
          <IndexModalBody flex={1} type={"modify"} setVisible={setModifyModalVisible} />
        </ModalParent>
      }
      {
        <ModalParent visible={recommendedModalVisible} setVisible={setRecommendedModalVisible}>
          <IndexListModalBody flex={1} title={"Recommended"} />
        </ModalParent>
      }
      {
        <ModalParent visible={myIndexesModalVisible} setVisible={setMyIndexesModalVisible}>
          <IndexListModalBody flex={1} title={"My Indexes"} />
        </ModalParent>
      }
      {
        <ModalParent visible={myIndexesModalVisible} setVisible={setMyIndexesModalVisible}>
          <IndexListModalBody flex={1} title={"My Indexes"} />
        </ModalParent>
      }
      {
        <ModalParent visible={walletConnectAlertVisible} setVisible={setWalletConnectAlertVisible} >
          <Flex alignCenter gridGap={"8px"} p={"10px 20px"} >
            <WarningIcon size={"25px"} color={"orange"} />
            Connect your wallet to create a portfolio.
          </Flex>
        </ModalParent>
      }

      <Flex gridGap={"16px"}>
        <Flex flex={1} col gridGap={"20px"}>
          <Flex alignCenter height={"50px"} borderBottom={"1px solid #34383b"}>
            <Box
              fontSize={"20px"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={() => {
                setRecommendedModalVisible(true);
              }}
            >
              Recommended
            </Box>
            {!walletConnected && (
              <Flex
                alignCenter
                gridGap={"4px"}
                ml={"auto"}
                padding={"8px 16px"}
                background={"#27282c"}
                p={"8px 16px"}
                border={"1px solid #34383b"}
                borderRadius={"8px"}
                cursor="pointer"
                onClick={() => setWalletConnectAlertVisible(true)}
              >
                <CreateIcon size={"1.2em"} />
                Create
              </Flex>
            )}
          </Flex>
          <Flex justifyCenter gridGap={"16px"}>
            <ChartBox
              flex={1}
              width={"0px"}
              maxWidth={"70%"}
              title={"Aptos Defi Pulse"}
              cursorAll={"pointer"}
              onClickAll={() => {
                setPortfolioModalVisible(true);
              }}
            />
            {!walletConnected && (
              <>
                <ChartBox
                  flex={1}
                  width={"0px"}
                  maxWidth={"70%"}
                  title={"Aptos Gaming Pulse"}
                  cursorAll={"pointer"}
                  onClickAll={() => {
                    setPortfolioModalVisible(true);
                  }}
                />
                <ChartBox
                  flex={1}
                  width={"0px"}
                  maxWidth={"70%"}
                  title={"Broad Crypto"}
                  cursorAll={"pointer"}
                  onClickAll={() => {
                    setPortfolioModalVisible(true);
                  }}
                />
              </>
            )}
          </Flex>
        </Flex>
        {walletConnected && (
          <Flex flex={1} col gridGap={"20px"}>
            <Flex alignCenter height={"50px"} borderBottom={"1px solid #34383b"}>
              <Flex alignItems={"flex-end"} gridGap={"8px"}>
                <Box
                  fontSize={currentTab === 0 ? "20px" : "16px"}
                  opacity={currentTab === 0 ? "1" : "0.5"}
                  fontWeight={"bold"}
                  cursor={"pointer"}
                  onClick={() => {
                    if (currentTab !== 0) setCurrentTab(0);
                    else setMyIndexesModalVisible(true);
                  }}
                  transition={"100ms"}
                >
                  My Indexes
                </Box>
                <Box
                  fontSize={currentTab === 1 ? "20px" : "16px"}
                  opacity={currentTab === 1 ? "1" : "0.5"}
                  fontWeight={"bold"}
                  cursor={"pointer"}
                  onClick={() => {
                    if (currentTab !== 1) setCurrentTab(1);
                    else setRecommendedModalVisible(true);
                  }}
                  transition={"100ms"}
                >
                  My Investments
                </Box>
              </Flex>
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
                onClick={() => setCreateModalVisible(true)}
              >
                <CreateIcon size={"1.2em"} />
                Create
              </Flex>
            </Flex>
            <Flex justifyCenter gridGap={"16px"}>
              <ChartBox
                flex={1}
                width={"0px"}
                maxWidth={"70%"}
                title={"Aptos Defi Pulse"}
                cursor={"pointer"}
                onClick={() => {
                  setModifyModalVisible(true);
                }}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default DashboardRecommended;
