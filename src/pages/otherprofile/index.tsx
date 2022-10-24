import { useWalletHook } from "common/hooks/wallet";
import {
  Box,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TextArea,
} from "components/base";
import { Flex } from "components/base/container";
import { ModalParent } from "components/modal";
import {
  ChartBox,
  IndexListModalBody,
  BlankCard,
} from "pages/components";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AptosClient } from "aptos";
import { Carousel3D } from "../common/comp.carousel";
import { MODULE_ADDR, NODE_URL } from "../../config";
import { IndexAllocation } from "../../utils/types";
import { getFormatedDate, getStringFee } from "../../utils";
import { FriendStatus, getFriendData } from "../../utils/graphql";
import FriendListModalBody from "../../components/modal/friend.list.modal.body";

interface MiraAccountProps {
  name: string;
  created: string;
}

interface FriendData {
  pool_owner: string;
  account_name: string;
  created: string;
  total_funds_invested: number;
}

interface MiraPoolSettings {
  management_fee: number;
  rebalancing_period: number;
  minimum_contribution: number;
  minimum_withdrawal_period: number;
  referral_reward: number;
  privacy_allocation: number;
}

interface MiraIndex {
  poolName: string;
  poolAddress: string;
  poolOwner: string;
  managementFee: string;
  founded: string;
  ownerName: string;
  rebalancingGas: number;
  indexAllocation: Array<IndexAllocation>;
  amount: number;
  gasPool: number;
  settings: MiraPoolSettings;
}

interface CreatePoolEvent {
  pool_name: string;
  pool_address: string;
  pool_owner: string;
  private_allocation: boolean;
  management_fee: number;
  founded: number;
}

interface MiraInvest {
  poolName: string;
  investor: string;
  poolAddress: string;
  poolOwner: string;
  amount: number;
  ownerName: string;
  rebalancingGas: number;
  indexAllocation: Array<IndexAllocation>;
  gasPool: number;
  settings: MiraPoolSettings;
}

interface DepositPoolEvent {
  pool_name: string;
  investor: string;
  amount: number;
  pool_address: string;
}

interface IUploadFile {
  file: string;
  imagePreviewUrl: string;
}
export const ProfileModalBody: React.FC<{ [index: string]: any }> = ({
  setVisible = () => {},
  profile = {},
  ...props
}) => {
  const { walletConnected, walletAddress } =
    useWalletHook();

  const [miraAccountProps, setMiraAccountProps] =
    useState<MiraAccountProps | null>(null);
  const [friendDataList, setFriendDataList] = useState<FriendData[]>([]);
  const [showFriendModal, setShowFriendModal] = useState<boolean>(false);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [modifyModalVisible, setModifyModalVisible] = useState(false);
  const [carouselStop, setCarouselStop] = useState(false);
  const [miraMyIndexes, setMiraMyIndexes] = useState<MiraIndex[]>([]);
  const [miraMyInvests, setMiraMyInvests] = useState<MiraInvest[]>([]);
  const [otherProfile, setProfile] = useState({});
  const [profileModalVisible, setProfileModalVisible] = useState(false);
    useState(false);

  const navigate = useNavigate();

  const [uploadFile, setUploadFile] = useState<IUploadFile>({
    file: "",
    imagePreviewUrl: require("assets/icon/258705.jpg"),
  });
  const [description, setDescription] = useState("");

  useEffect(() => {
    // if (walletAddress) {
      fetchIndexes();
      fetchInvests();
    // }

    // !walletConnected && navigate("/");
    // const initMiraAccountProps = async () => {
    //   const client = new AptosClient(NODE_URL);
    //   try {
    //     let resource = await client.getAccountResource(
    //       walletAddress,
    //       `${MODULE_ADDR}::mira::MiraAccount`
    //     );
    //     if (!resource) {
    //       navigate("/");
    //       return;
    //     }

    //     const data = resource?.data as {
    //       account_name: string;
    //       created: number;
    //     };

    //     setMiraAccountProps({
    //       name: data?.account_name,
    //       created: getFormatedDate(data?.created),
    //     });
    //   } catch (error) {
    //     navigate("/");
    //     return;
    //   }
    // };

    // const getFriendInfo = async (owner_addr: string) => {
    //   const aptos_client = new AptosClient(NODE_URL);
    //   let resource = await aptos_client.getAccountResource(
    //     owner_addr,
    //     `${MODULE_ADDR}::mira::MiraAccount`
    //   );
    //   if (!resource) {
    //     return null;
    //   }
    //   const data = resource?.data as FriendData;
    //   data.pool_owner = owner_addr;
    //   return data;
    // };

    // const getFriendList = async () => {
    //   if (!walletConnected) return;
    //   let friends = await getFriendData(walletAddress);
    //   friends.map(async (friend, index) => {
    //     if (friend.status !== FriendStatus.Friend) return;
    //     let f = await getFriendInfo(friend.receiveUser);
    //     if (f) {
    //       setFriendDataList([...friendDataList, f]);
    //     }
    //   });
    // };

    // initMiraAccountProps();
    // getFriendList();
  }, [walletConnected, navigate, walletAddress]);

  const [myIndexesModalVisible, setMyIndexesModalVisible] = useState(false);
  const [myInvestmentsModalVisible, setMyInvestmentsModalVisible] =
    useState(false);

  const Carousel3D2 = useRef(null);
  const Carousel3D3 = useRef(null);

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
      if (profile.owner_address !== e.pool_owner) continue;

      let resource = await client.getAccountResource(
        e.pool_owner,
        `${MODULE_ADDR}::mira::MiraAccount`
      );

      let resource_data = resource?.data as {
        account_name: string;
      };

      try {
        let res = await client.getAccountResource(
          e.pool_address,
          `${MODULE_ADDR}::mira::MiraPool`
        );

        const data = res?.data as {
          amount: number;
          gas_pool: number;
          index_allocation: Array<number>;
          index_list: Array<string>;
          rebalancing_gas: number;
          settings: MiraPoolSettings;
        };

        let allocation: IndexAllocation[] = [];
        for (let i = 0; i < data?.index_allocation.length; i++) {
          allocation.push({
            name: data?.index_list[i],
            value: data?.index_allocation[i] * 1,
          });
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
          settings: data?.settings,
        });
      } catch (error) {
        console.log("get mira pools error", error);
      }
    }
    setMiraMyIndexes(create_pool_events);
  };

  const fetchInvests = async () => {
    const client = new AptosClient(NODE_URL);
    let events = await client.getEventsByEventHandle(
      MODULE_ADDR,
      `${MODULE_ADDR}::mira::MiraStatus`,
      "deposit_pool_events",
      { limit: 1000 }
    );
    let deposit_pool_events: MiraInvest[] = [];
    for (let ev of events) {
      let e: DepositPoolEvent = ev.data;
      if (profile.owner_address !== e.investor) continue;

      try {
        let res = await client.getAccountResource(
          e.pool_address,
          `${MODULE_ADDR}::mira::MiraPool`
        );

        const data = res?.data as {
          manager_addr: string;
          amount: number;
          gas_pool: number;
          index_allocation: Array<number>;
          index_list: Array<string>;
          rebalancing_gas: number;
          settings: MiraPoolSettings;
        };

        let allocation: IndexAllocation[] = [];
        for (let i = 0; i < data?.index_allocation.length; i++) {
          allocation.push({
            name: data?.index_list[i],
            value: data?.index_allocation[i] * 1,
          });
        }

        let resource = await client.getAccountResource(
          data?.manager_addr,
          `${MODULE_ADDR}::mira::MiraAccount`
        );

        let resource_data = resource?.data as {
          account_name: string;
        };

        deposit_pool_events.push({
          poolName: e.pool_name,
          investor: e.investor,
          poolAddress: e.pool_address,
          poolOwner: data?.manager_addr,
          amount: e.amount,
          ownerName: resource_data.account_name,
          rebalancingGas: data?.rebalancing_gas,
          indexAllocation: allocation,
          gasPool: data?.gas_pool,
          settings: data?.settings,
        });
      } catch (error) {
        console.log("get mira pools error", error);
      }
    }
    setMiraMyInvests(deposit_pool_events);
  };

  const onDescriptionChange = (e: any) => {
    if (e.target.value.length <= 160) {
      setDescription(e.target.value);
    }
  };

  const photoUpload = (e) => {
    console.log("photo");
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setUploadFile({
        file: file,
        imagePreviewUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {walletConnected && (
        <ModalParent visible={showFriendModal} setVisible={setShowFriendModal}>
          <FriendListModalBody flex={1} setVisible={setShowFriendModal} />
        </ModalParent>
      )}

      {
        <ModalParent
          visible={myIndexesModalVisible}
          setVisible={setMyIndexesModalVisible}
        >
          <IndexListModalBody
            flex={1}
            type={"create"}
            title={profile.owner + "'s Indexes"}
          />
        </ModalParent>
      }
      {
        <ModalParent
          visible={myInvestmentsModalVisible}
          setVisible={setMyInvestmentsModalVisible}
        >
          <IndexListModalBody
            flex={1}
            type={"create"}
            title={profile.owner + "'s Investments"}
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
            profile={otherProfile}
          />
        </ModalParent>
      }
      <Flex col py={"20px"} gridGap={"20px"} height={"70vh"} overflow={"auto"}>
        <Flex flex={1} col gridGap={"20px"}>
          <Flex height={"42px"}>
            <Flex fontFamily={"art"} fontSize={"24px"} fontWeight={"bold"}>
              {profile.owner}
            </Flex>
          </Flex>
          <Flex gridGap={"20px"} px={"32px"}>
            <Flex col gridGap={"16px"}>
              <Flex>
                <ImgUpload
                  onChange={photoUpload}
                  src={uploadFile.imagePreviewUrl}
                />
              </Flex>
              <Flex alignCenter gridGap={"16px"}>
                <Flex
                  alignCenter
                  gridGap={"4px"}
                  background={"#0005"}
                  p={"8px 16px"}
                  border={"1px solid #34383b"}
                  borderRadius={"8px"}
                >
                  <Input
                    border={"none"}
                    background={"transparent"}
                    color={"white"}
                    placeholder={"user_name"}
                    value={profile.owner}
                    readOnly={true}
                  />
                </Flex>
                {walletConnected && (
                  <Flex
                    center
                    background={"linear-gradient(90deg, #131313, #2b2b2b)"}
                    borderRadius={"50%"}
                    width={"100px"}
                    height={"40px"}
                    border={"3px solid #272c2e"}
                    boxShadow={
                      "-5px -3px 10px 0px #fff2, 5px 3px 10px 0px #0006"
                    }
                    cursor={"pointer"}
                    onClick={() => {
                      setShowFriendModal(true);
                    }}
                  >
                    Friend List
                  </Flex>
                )}
              </Flex>
              <Flex alignCenter gridGap={"16px"}>
                <Flex
                  alignCenter
                  gridGap={"4px"}
                  background={"#0005"}
                  p={"8px 16px"}
                  border={"1px solid #34383b"}
                  borderRadius={"8px"}
                >
                  <Input
                    border={"none"}
                    background={"transparent"}
                    color={"white"}
                    placeholder={"user_name"}
                    value={"kazakhstan"}
                    readOnly={true}
                  />
                </Flex>
              </Flex>

            </Flex>
            <Flex
              flexFull
              col
              background={"#302d38"}
              p={"20px"}
              border={"1px solid #34383b"}
              borderRadius={"40px 10px"}
              gridGap={"12px"}
            >
              <Flex
                p={"10px"}
                fontSize={"18px"}
                fontWeight={"500"}
                borderBottom={"1px solid #34383b"}
              >
                Investing since {"January 07, 2022"}
                <Flex fontWeight={"bold"}>{miraAccountProps?.created}</Flex>
              </Flex>
              <Flex flexFull>
                <TextArea
                  width={"100%"}
                  placeholder={"Max 160 chars"}
                  placeColor={"#70e094"}
                  color={"#fff"}
                  border={"none"}
                  backgroundColor={"transparent"}
                  value={description}
                  onChange={onDescriptionChange}
                ></TextArea>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex p={"20px"}>
          <Flex flex={3} width={"0px"} p={"20px"} aspectRatio={"3"}>
            <Flex flex={1} col gridGap={"20px"}>
              <Flex
                height={"42px"}
                fontFamily={"art"}
                fontSize={"20px"}
                fontWeight={"bold"}
                borderBottom={"1px solid #34383b"}
              >
                Stats
              </Flex>
              <Flex gridGap={"16px"}>
                <Flex col gridGap={"16px"} flex={1}>
                  <Flex gridGap={"16px"}>
                    <Flex
                      col
                      flex={1}
                      background={"#302d38"}
                      p={"20px 40px"}
                      border={"1px solid #34383b"}
                      borderRadius={"10px 40px"}
                      gridGap={"12px"}
                    >
                      <Flex width={"100%"}>something</Flex>
                      <Flex
                        width={"100%"}
                        fontSize={"48px"}
                        fontWeight={"500"}
                        alignItems={"center"}
                        gridGap={"8px"}
                        color={"#70e094"}
                      >
                        20
                        <Box
                          fontSize={"0.7em"}
                          opacity={"0.8"}
                          color={"#70e094"}
                        >
                          %
                        </Box>
                      </Flex>
                    </Flex>
                    <Flex
                      col
                      flex={1}
                      background={"#302d38"}
                      p={"20px 40px"}
                      border={"1px solid #34383b"}
                      borderRadius={"10px 40px"}
                      gridGap={"12px"}
                    >
                      <Flex width={"100%"}>something</Flex>
                      <Flex
                        width={"100%"}
                        fontSize={"48px"}
                        fontWeight={"500"}
                        alignItems={"center"}
                        gridGap={"8px"}
                        color={"#70e094"}
                      >
                        20
                        <Box
                          fontSize={"0.7em"}
                          opacity={"0.8"}
                          color={"#70e094"}
                        >
                          %
                        </Box>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex gridGap={"16px"}>
                    <Flex
                      col
                      flex={1}
                      background={"#302d38"}
                      p={"20px 40px"}
                      border={"1px solid #34383b"}
                      borderRadius={"10px 40px"}
                      gridGap={"12px"}
                    >
                      <Flex width={"100%"}>something</Flex>
                      <Flex
                        width={"100%"}
                        fontSize={"48px"}
                        fontWeight={"500"}
                        alignItems={"center"}
                        gridGap={"8px"}
                        color={"#70e094"}
                      >
                        20
                        <Box
                          fontSize={"0.7em"}
                          opacity={"0.8"}
                          color={"#70e094"}
                        >
                          %
                        </Box>
                      </Flex>
                    </Flex>
                    <Flex
                      col
                      flex={1}
                      background={"#302d38"}
                      p={"20px 40px"}
                      border={"1px solid #34383b"}
                      borderRadius={"10px 40px"}
                      gridGap={"12px"}
                    >
                      <Flex width={"100%"}>something</Flex>
                      <Flex
                        width={"100%"}
                        fontSize={"48px"}
                        fontWeight={"500"}
                        alignItems={"center"}
                        gridGap={"8px"}
                        color={"#70e094"}
                      >
                        20
                        <Box
                          fontSize={"0.7em"}
                          opacity={"0.8"}
                          color={"#70e094"}
                        >
                          %
                        </Box>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  flex={1}
                  col
                  background={"#302d38"}
                  p={"20px"}
                  border={"1px solid #34383b"}
                  borderRadius={"40px 10px"}
                  gridGap={"12px"}
                >
                  <Flex
                    p={"10px"}
                    fontSize={"18px"}
                    fontWeight={"500"}
                    borderBottom={"1px solid #34383b"}
                  >
                    More Data
                  </Flex>
                  <Flex flexFull>
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                    Instead of sidebar, we can also downsize to About, Discord,
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex gridGap={"16px"}>
          <Flex flex={1} col gridGap={"20px"}>
            <Flex
              height={"42px"}
              fontFamily={"art"}
              fontSize={"20px"}
              fontWeight={"bold"}
              borderBottom={"1px solid #34383b"}
            >
              <Box
                cursor="pointer"
                onClick={() => setMyIndexesModalVisible(true)}
              >
                {profile.owner}'s Indexes
              </Box>
            </Flex>
            <Flex justifyCenter gridGap={"16px"}>
              {miraMyIndexes.length > 0 ? (
                <Carousel3D
                  ref={Carousel3D3}
                  stop={
                    portfolioModalVisible || modifyModalVisible || carouselStop
                  }
                  onMouseEnter={() => {
                    setCarouselStop(true);
                  }}
                  onMouseLeave={() => {
                    setCarouselStop(false);
                  }}
                >
                  {miraMyIndexes.map((item, index) => {
                    return (
                      <ChartBox
                        key={index}
                        flex={1}
                        width={"0px"}
                        maxWidth={"70%"}
                        title={item.poolName}
                        owner={item.ownerName}
                        indexAllocation={item.indexAllocation}
                        cursor={"pointer"}
                        onClickTitle={() => {
                          setProfile({
                            pool_name: item.poolName,
                            owner: item.ownerName,
                            owner_address: item.poolOwner,
                          });
                          setProfileModalVisible(true);
                        }}
                      />
                    );
                  })}
                </Carousel3D>
              ) : (
                <BlankCard
                  flex={1}
                  maxWidth={"70%"}
                  minHeight={"245px"}
                  type={"index"}
                />
              )}
            </Flex>
          </Flex>
          <Flex flex={1} col gridGap={"20px"}>
            <Flex
              height={"42px"}
              fontFamily={"art"}
              fontSize={"20px"}
              fontWeight={"bold"}
              borderBottom={"1px solid #34383b"}
            >
              <Box
                cursor="pointer"
                onClick={() => setMyInvestmentsModalVisible(true)}
              >
                {profile.owner}'s Investments
              </Box>
            </Flex>
            <Flex justifyCenter gridGap={"16px"}>
              {miraMyInvests.length > 0 ? (
                <Carousel3D
                  ref={Carousel3D2}
                  stop={
                    portfolioModalVisible || modifyModalVisible || carouselStop
                  }
                  onMouseEnter={() => {
                    setCarouselStop(true);
                  }}
                  onMouseLeave={() => {
                    setCarouselStop(false);
                  }}
                >
                  {miraMyInvests.map((item, index) => {
                    return (
                      <ChartBox
                        key={index}
                        flex={1}
                        width={"0px"}
                        maxWidth={"70%"}
                        title={item.poolName}
                        owner={item.ownerName}
                        indexAllocation={item.indexAllocation}
                        cursor={"pointer"}
                        onClickTitle={() => {
                          setProfile({
                            username: item.poolName,
                            owner: item.ownerName,
                            owner_address: item.poolOwner,
                          });
                          setProfileModalVisible(true);
                        }}
                      />
                    );
                  })}
                </Carousel3D>
              ) : (
                <BlankCard
                  flex={1}
                  maxWidth={"70%"}
                  minHeight={"245px"}
                  type={"index"}
                />
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          height={"42px"}
          fontSize={"20px"}
          fontWeight={"bold"}
          borderBottom={"1px solid #34383b"}
        >
          <Box> {profile.owner}'s Friends</Box>
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
                <Th>Profile Name</Th>
                <Th>Pool's owner</Th>
                <Th>Created date</Th>
                <Th>Total Invested</Th>
              </Tr>
            </Thead>
            <Tbody>
              {friendDataList &&
                friendDataList.map((friend, index) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        <Flex alignCenter gridGap={"10px"} cursor={"pointer"}>
                          <Box
                            background={
                              "linear-gradient(90deg,#fceabb,#f8b500)"
                            }
                            borderRadius={"100%"}
                            width={"25px"}
                            height={"25px"}
                          ></Box>
                          {friend.account_name}
                        </Flex>
                      </Td>
                      <Td>{friend.pool_owner}</Td>
                      <Td>{getFormatedDate(parseInt(friend.created))}</Td>
                      <Td>{friend.total_funds_invested} Aptos</Td>
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

const ImgUpload: React.FC<{
  onChange?: (arg: any) => void;
  src?: string;
}> = ({ onChange, src }) => {
  return (
    <Flex>
      <img
        src={src}
        width={150}
        style={{
          borderRadius: "20px",
        }}
        alt={"profile avatar"}
      />
      {/* <label htmlFor="photo-upload">
        <Flex
          cursor={"pointer"}
          position={"relative"}
          top={"10px"}
          left={"-35px"}
          backgroundColor={"#000"}
          fontSize={"26px"}
        >
          <PencilIcon />
        </Flex>
        <input
          id="photo-upload"
          type="file"
          onChange={onChange}
          style={{ display: "none" }}
        />
      </label> */}
    </Flex>
  );
};
