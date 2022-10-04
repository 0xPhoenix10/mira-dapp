import { useWalletHook } from "common/hooks/wallet";
import { Box, Input, Table, Tbody, Td, Th, Thead, Tr } from "components/base";
import { Flex } from "components/base/container";
import { ArrowIcon, PencilIcon } from "components/icons";
import { ModalParent } from "components/modal";
import { ChartBox, IndexListModalBody } from "pages/components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AptosClient } from "aptos";
import { MODULE_ADDR, NODE_URL } from "../../config";
// import {Simulate} from "react-dom/test-utils";
// import input = Simulate.input;
import { getFormatedDate, stringToHex } from "../../utils";
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
const ProfilePage = () => {
  const { walletConnected, walletAddress, signAndSubmitTransaction, wallet } =
    useWalletHook();

  const [miraAccountProps, setMiraAccountProps] =
    useState<MiraAccountProps | null>(null);
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [friendDataList, setFriendDataList] = useState<FriendData[]>([]);
  const [showFriendModal, setShowFriendModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    !walletConnected && navigate("/");
    const initMiraAccountProps = async () => {
      const client = new AptosClient(NODE_URL);
      try {
        let resource = await client.getAccountResource(
          walletAddress,
          `${MODULE_ADDR}::mira::MiraAccount`
        );
        if (!resource) {
          navigate("/");
          return;
        }

        const data = resource?.data as {
          account_name: string;
          created: number;
        };
        setInputNameValue(data?.account_name);
        setMiraAccountProps({
          name: data?.account_name,
          created: getFormatedDate(data?.created),
        });
      } catch (error) {
        navigate("/");
        return;
      }
    };

    const getFriendInfo = async (owner_addr: string) => {
      const aptos_client = new AptosClient(NODE_URL);
      let resource = await aptos_client.getAccountResource(
        owner_addr,
        `${MODULE_ADDR}::mira::MiraAccount`
      );
      if (!resource) {
        return null;
      }
      const data = resource?.data as FriendData;
      data.pool_owner = owner_addr;
      return data;
    };

    const getFriendList = async () => {
      if (!walletConnected) return;
      let friends = await getFriendData(walletAddress);
      friends.map(async (friend, index) => {
        if (friend.status !== FriendStatus.Friend) return;
        let f = await getFriendInfo(friend.receiveUser);
        if (f) {
          setFriendDataList([...friendDataList, f]);
        }
      });
    };

    initMiraAccountProps();
    getFriendList();
  }, [walletConnected, friendDataList, navigate, walletAddress]);

  const [myIndexesModalVisible, setMyIndexesModalVisible] = useState(false);
  const [myInvestmentsModalVisible, setMyInvestmentsModalVisible] =
    useState(false);

  const changeMiraAccountName = async () => {
    if (
      inputNameValue === miraAccountProps?.name ||
      inputNameValue.trim() === ""
    ) {
      return;
    }
    let name = inputNameValue.trim();

    if (wallet && wallet.adapter.name === "Pontem") {
      name = "0x" + stringToHex(name);
    }

    const transaction = {
      type: "entry_function_payload",
      function: `${MODULE_ADDR}::mira::change_account_name`,
      arguments: [name as string],
      type_arguments: [],
    };
    await signAndSubmitTransaction(transaction);
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
          <IndexListModalBody flex={1} type={"create"} title={"My Indexes"} />
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
            title={"My Investments"}
          />
        </ModalParent>
      }
      <Flex
        col
        width={"100%"}
        height={"max-content"}
        py={"20px"}
        gridGap={"20px"}
      >
        <Flex flex={1} col gridGap={"20px"}>
          <Flex height={"42px"}>
            <Flex fontSize={"24px"} fontWeight={"bold"}>
              My Profile
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
              onClick={() => navigate("/")}
            >
              <ArrowIcon dir={"left"} size={"1.2em"} />
              Back to Home
            </Flex>
          </Flex>
          <Flex alignCenter gridGap={"16px"}>
            name :
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
                value={inputNameValue}
                onChange={(e) => {
                  setInputNameValue(e.target.value);
                }}
              />
              <Flex cursor={"pointer"} onClick={() => changeMiraAccountName()}>
                <PencilIcon />
              </Flex>
            </Flex>
            {walletConnected && (
              <Flex
                center
                background={"linear-gradient(90deg, #131313, #2b2b2b)"}
                borderRadius={"100%"}
                width={"40px"}
                height={"40px"}
                border={"3px solid #272c2e"}
                boxShadow={"-5px -3px 10px 0px #fff2, 5px 3px 10px 0px #0006"}
                cursor={"pointer"}
                onClick={() => {
                  setShowFriendModal(true);
                }}
              >
                Friend List
              </Flex>
            )}
          </Flex>
          <Flex gridGap={"16px"}>
            date created :{" "}
            <Flex fontWeight={"bold"}>{miraAccountProps?.created}</Flex>
          </Flex>
        </Flex>
        <Flex flex={1} col gridGap={"20px"}>
          <Flex
            height={"42px"}
            fontSize={"20px"}
            fontWeight={"bold"}
            borderBottom={"1px solid #34383b"}
          >
            Stats
          </Flex>
          <Flex gridGap={"16px"}>
            <Flex gridGap={"20px"}>
              <Flex col gridGap={"16px"}>
                <Flex gridGap={"16px"}>
                  <Flex
                    col
                    flex={1}
                    background={"#101012"}
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
                      color={"#49abc9"}
                    >
                      20
                      <Box fontSize={"0.7em"} opacity={"0.8"} color={"#2a3e5b"}>
                        %
                      </Box>
                    </Flex>
                  </Flex>
                  <Flex
                    col
                    flex={1}
                    background={"#101012"}
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
                      color={"#49abc9"}
                    >
                      20
                      <Box fontSize={"0.7em"} opacity={"0.8"} color={"#2a3e5b"}>
                        %
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gridGap={"16px"}>
                  <Flex
                    col
                    flex={1}
                    background={"#101012"}
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
                      color={"#49abc9"}
                    >
                      20
                      <Box fontSize={"0.7em"} opacity={"0.8"} color={"#2a3e5b"}>
                        %
                      </Box>
                    </Flex>
                  </Flex>
                  <Flex
                    col
                    flex={1}
                    background={"#101012"}
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
                      color={"#49abc9"}
                    >
                      20
                      <Box fontSize={"0.7em"} opacity={"0.8"} color={"#2a3e5b"}>
                        %
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                flexFull
                col
                background={"#101012"}
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
                  and Twitter, adding all icons to the left of Connect Wallet
                  Instead of sidebar, we can also downsize to About, Discord,
                  and Twitter, adding all icons to the left of Connect Wallet
                  Instead of sidebar, we can also downsize to About, Discord,
                  and Twitter, adding all icons to the left of Connect Wallet
                  Instead of sidebar, we can also downsize to About, Discord,
                  and Twitter, adding all icons to the left of Connect Wallet
                  Instead of sidebar, we can also downsize to About, Discord,
                  and Twitter, adding all icons to the left of Connect Wallet
                  Instead of sidebar, we can also downsize to About, Discord,
                  and Twitter, adding all icons to the left of Connect Wallet
                </Flex>
              </Flex>
            </Flex>
            <Flex></Flex>
          </Flex>
        </Flex>
        <Flex gridGap={"16px"}>
          <Flex flex={1} col gridGap={"20px"}>
            <Flex
              height={"42px"}
              fontSize={"20px"}
              fontWeight={"bold"}
              borderBottom={"1px solid #34383b"}
            >
              <Box
                cursor="pointer"
                onClick={() => setMyIndexesModalVisible(true)}
              >
                My Indexes
              </Box>
            </Flex>
            <Flex justifyCenter gridGap={"16px"}>
              <ChartBox flex={1} width={"0px"} title={"Aptos Defi Pulse"} />
            </Flex>
          </Flex>
          <Flex flex={1} col gridGap={"20px"}>
            <Flex
              height={"42px"}
              fontSize={"20px"}
              fontWeight={"bold"}
              borderBottom={"1px solid #34383b"}
            >
              <Box
                cursor="pointer"
                onClick={() => setMyInvestmentsModalVisible(true)}
              >
                My Investments
              </Box>
            </Flex>
            <Flex justifyCenter gridGap={"16px"}>
              <ChartBox flex={1} width={"0px"} title={"Aptos Defi Pulse"} />
            </Flex>
          </Flex>
        </Flex>
        <Flex
          height={"42px"}
          fontSize={"20px"}
          fontWeight={"bold"}
          borderBottom={"1px solid #34383b"}
        >
          <Box> My Friends</Box>
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

export default ProfilePage;
