import React, { useEffect, useState } from "react";
import { Box } from "components/base";
import { ChartBox, BlankCard } from "pages/components";
import { Flex } from "components/base/container";
import { PortfolioModalBody } from "../dashboard/portfolio.modal.body";

import { useWalletHook } from "common/hooks/wallet";
import { ModalParent } from "components/modal";
import { ProfileModalBody } from "../otherprofile";
import { IndexAllocation } from '../../utils/types'
import "./ourtoken.css";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { AptosClient } from 'aptos'
import { MODULE_ADDR, NODE_URL } from 'config'
import { getFormatedDate, getStringFee } from '../../utils'

interface MiraPoolSettings {
  management_fee: number
  rebalancing_period: number
  minimum_contribution: number
  minimum_withdrawal_period: number
  referral_reward: number
  privacy_allocation: number
}

interface MiraIndex {
  poolName: string
  poolAddress: string
  poolOwner: string
  managementFee: string
  founded: string
  ownerName: string
  rebalancingGas: number
  indexAllocation: Array<IndexAllocation>
  amount: number
  gasPool: number
  settings: MiraPoolSettings
}

interface CreatePoolEvent {
  pool_name: string
  pool_address: string
  pool_owner: string
  privacy_allocation: number
  management_fee: number
  founded: number
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: "transparent",
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "transparent",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: "0px",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "1px",
  // borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const OurTokenPage: React.FC = () => {
  const { walletAddress } = useWalletHook()
  const [showPortfolio, setPortfolioModal] = useState<boolean>(false);
  const [profile, setProfile] = useState({});
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [miraIndexes, setMiraIndexes] = useState<MiraIndex[]>([])
  const [selectIndexInfo, setSelectIndexInfo] = useState<MiraIndex | null>(
    null
  );
  
  useEffect(() => {
    if (walletAddress) {
      fetchMiraIndexes()
    }
  }, [walletAddress])

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const fetchMiraIndexes = async () => {
    const client = new AptosClient(NODE_URL)

    try {
      let events = await client.getEventsByEventHandle(
        MODULE_ADDR,
        `${MODULE_ADDR}::mira::MiraStatus`,
        'create_pool_events',
        { limit: 1000 },
      )

      let create_pool_events: MiraIndex[] = []
      for (let ev of events) {
        let e: CreatePoolEvent = ev.data
        if (MODULE_ADDR !== e.pool_owner) continue

        let resource = await client.getAccountResource(
          e.pool_owner,
          `${MODULE_ADDR}::mira::MiraAccount`
        );
        
        let resource_data = resource?.data as {
          account_name: string
        }

        try {
          let res = await client.getAccountResource(
            e.pool_address,
            `${MODULE_ADDR}::mira::MiraPool`,
          )
          
          const data = res?.data as {
            amount: number
            gas_pool: number
            index_allocation: Array<number>
            index_list: Array<string>
            rebalancing_gas: number
            settings: MiraPoolSettings
          }

          let allocation: IndexAllocation[] = []
          for (let i = 0; i < data?.index_allocation.length; i++) {
            allocation.push({
              name: data?.index_list[i],
              value: data?.index_allocation[i] * 1,
            })
          }

          create_pool_events.push({
            poolName: e.pool_name,
            poolAddress: e.pool_address,
            poolOwner: e.pool_owner,
            managementFee: getStringFee(e.management_fee),
            founded: getFormatedDate(e.founded),
            ownerName: resource_data.account_name,
            rebalancingGas: data?.rebalancing_gas,
            indexAllocation: allocation,
            amount: data?.amount,
            gasPool: data?.gas_pool,
            settings: data?.settings
          })
        } catch (error) {
          console.log('get mira pools error', error)
        }
      }
      setMiraIndexes(create_pool_events)
    } catch (error) {
      console.log('set mira indexes error', error)
    }
  }

  return (
    <>
      <Box width={"100%"}>
        <Box>
          <Flex py={"20px"}
            px={"32px"}>
            <Flex
              fontFamily={"art"}
              fontSize={"24px"}
              fontWeight={"bold"}
              borderBottom={"1px solid"}
              p={"10px 30px"}
            >
              Mira's in-house Index Funds
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex
            col
            py={"20px"}
            px={"32px"}
            gridGap={"20px"}
            overflow={"auto"}
            width={"100%"}
          >
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Flex
                  fontSize={"20px"}
                  borderBottom={"1px solid"}
                  p={"10px 30px"}
                  color={"#fff"}
                  alignCenter
                  minWidth={"300px"}
                  spaceBetween
                >
                  Broad Crypto
                  <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "#fff" }} />
                </Flex>
              </AccordionSummary>
              <AccordionDetails>
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
                  {miraIndexes.length > 0 ? (
                    miraIndexes.map((item, index) => {
                      return (
                        <ChartBox
                          key={index}
                          flex={1}
                          width={'100%'}
                          title={item.poolName}
                          owner={item.ownerName}
                          indexAllocation={item.indexAllocation}
                          cursor={'pointer'}
                          onClickPieChart={() => {
                            setPortfolioModal(true)
                            setSelectIndexInfo(item)
                          }}
                          onClickTitle={() => {
                            setProfile({
                              username: item.poolName,
                              owner: item.ownerName,
                              owner_address: item.poolOwner
                            })
                            setProfileModalVisible(true)
                          }}
                        />
                      )
                    }
                  )) : (
                    <BlankCard
                      flex={1}
                      maxWidth={'70%'}
                      minHeight={'245px'}
                      type={'index'}
                    />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Flex
                  fontSize={"20px"}
                  borderBottom={"1px solid"}
                  p={"10px 30px"}
                  color={"#fff"}
                  alignCenter
                  minWidth={"300px"}
                  spaceBetween
                >
                  Aptos
                  <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "#fff" }} />
                </Flex>
              </AccordionSummary>
              <AccordionDetails>
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
                  {miraIndexes.length > 0 ? (
                    miraIndexes.map((item, index) => {
                      return (
                        <ChartBox
                          key={index}
                          flex={1}
                          width={'100%'}
                          title={item.poolName}
                          owner={item.ownerName}
                          indexAllocation={item.indexAllocation}
                          cursor={'pointer'}
                          onClickPieChart={() => {
                            setPortfolioModal(true)
                            setSelectIndexInfo(item)
                          }}
                          onClickTitle={() => {
                            setProfile({
                              username: item.poolName,
                              owner: item.ownerName,
                              owner_address: item.poolOwner
                            })
                            setProfileModalVisible(true)
                          }}
                        />
                      )
                    }
                  )) : (
                    <BlankCard
                      flex={1}
                      maxWidth={'70%'}
                      minHeight={'245px'}
                      type={'index'}
                    />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Flex
                  fontSize={"20px"}
                  borderBottom={"1px solid"}
                  p={"10px 30px"}
                  color={"#fff"}
                  alignCenter
                  minWidth={"300px"}
                  spaceBetween
                >
                  Sui
                  <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "#fff" }} />
                </Flex>
              </AccordionSummary>
              <AccordionDetails>
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
                  {miraIndexes.length > 0 ? (
                    miraIndexes.map((item, index) => {
                      return (
                        <ChartBox
                          key={index}
                          flex={1}
                          width={'100%'}
                          title={item.poolName}
                          owner={item.ownerName}
                          indexAllocation={item.indexAllocation}
                          cursor={'pointer'}
                          onClickPieChart={() => {
                            setPortfolioModal(true)
                            setSelectIndexInfo(item)
                          }}
                          onClickTitle={() => {
                            setProfile({
                              username: item.poolName,
                              owner: item.ownerName,
                              owner_address: item.poolOwner
                            })
                            setProfileModalVisible(true)
                          }}
                        />
                      )
                    }
                  )) : (
                    <BlankCard
                      flex={1}
                      maxWidth={'70%'}
                      minHeight={'245px'}
                      type={'index'}
                    />
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Flex>
        </Box>
      </Box>

      {
        <ModalParent visible={showPortfolio} setVisible={setPortfolioModal}>
          <PortfolioModalBody
            flex={1}
            setVisible={showPortfolio}
            miraIndexInfo={selectIndexInfo}
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
    </>
  );
};

// const SwapSection = () => {
//   const { walletConnected, openConnectModal } = useWalletHook();
//   return (
//     <Flex
//       col
//       my={"auto"}
//       justifyContent={"space-around"}
//       gridGap={"10px"}
//       background={"#302D38"}
//       padding={"20px"}
//       border={"1px solid #34383b"}
//       borderRadius={"20px"}
//     >
//       <Flex
//         mx={"auto"}
//         fontFamily={"art"}
//         fontSize={"20px"}
//         fontWeight={"bold"}
//       >
//         Swap
//       </Flex>
//       <Flex mt={"1em"} fontSize={"16px"}>
//         From
//       </Flex>
//       <SwapBox />
//       <Link
//         mx={"auto"}
//         fontSize={"2em"}
//         p={"12px"}
//         border={"1px solid #fff3"}
//         borderRadius={"20px"}
//       >
//         <ExchangeIcon />
//       </Link>
//       <Flex mt={"-2em"} fontSize={"16px"}>
//         To
//       </Flex>
//       <SwapBox />
//       {walletConnected ? (
//         <ArtButton
//           mt={"24px"}
//           mx={"auto"}
//           minWidth={"150px"}
//           padding={"12px 24px"}
//           textAlign={"center"}
//         >
//           Swap
//         </ArtButton>
//       ) : (
//         <ArtButton
//           mt={"24px"}
//           mx={"auto"}
//           minWidth={"150px"}
//           padding={"12px 24px"}
//           textAlign={"center"}
//           onClick={() => openConnectModal()}
//         >
//           Connect Wallet
//         </ArtButton>
//       )}
//     </Flex>
//   );
// };

// const SwapBox = () => {
//   return (
//     <Flex
//       col
//       gridGap={"12px"}
//       background={"#3c3a45"}
//       width={"300px"}
//       p={"12px 24px"}
//       border={"1px solid #fff3"}
//       borderRadius={"20px"}
//     >
//       <Flex alignCenter justifyContent={"space-between"}>
//         <Flex col>
//           <Flex color={"#70e094"} fontSize={"1.4em"} fontWeight={"bold"}>
//             0.0
//           </Flex>
//           <Flex>$0.0</Flex>
//         </Flex>
//         <Flex bg={"#302d38"} borderRadius={"8px"}>
//           <CustomSelect>
//             <SmOption value={"APTOS"} selected>
//               APTOS
//             </SmOption>
//             <SmOption value={"XSI"}>XSI</SmOption>
//           </CustomSelect>
//         </Flex>
//       </Flex>
//       <Flex alignCenter justifyContent={"flex-end"} gridGap={"8px"}>
//         <Flex>Balance :</Flex>
//         <Flex>10</Flex>
//         <Link ml={"8px"} p={"4px 8px"} bg={"#26242f"} borderRadius={"4px"}>
//           Max
//         </Link>
//       </Flex>
//     </Flex>
//   );
// };

export default OurTokenPage;
