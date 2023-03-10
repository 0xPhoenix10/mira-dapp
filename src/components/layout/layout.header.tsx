import { useWalletHook } from "common/hooks/wallet";
import { Box, Image } from "components/base";
import { Flex } from "components/base/container";
import { ArtButton } from "components/elements/buttons";
import { UserIcon } from "components/icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MODULE_ADDR, NODE_URL, CHAIN_LIST } from "config";
import { AptosClient } from "aptos";
import { getRandomizeString } from "../../utils";
import { CustomSelect, SmOption } from "components/form";
import { FrontContext } from "providers/provider.front";
import { useContext } from "react";

const LayoutHeader = () => {
  const navigate = useNavigate();
  const {
    walletConnected,
    openConnectModal,
    walletAddress,
    walletDisconnect,
    signAndSubmitTransaction,
  } = useWalletHook();
  const { currentChain, setCurrentChain } = useContext(FrontContext);
  // const [createdMiraAccount, setCreatedMiraAccount] = useState<boolean>(false);

  useEffect(() => {
    if (walletConnected) {
      const createMiraAccount = async () => {
        const client = new AptosClient(NODE_URL);

        try {
          let resource = await client.getAccountResource(
            walletAddress,
            `${MODULE_ADDR}::mira::MiraAccount`
          );
          if (resource) {
            // setCreatedMiraAccount(true);
            return;
          }
        } catch (error) {}

        const transaction = {
          type: "entry_function_payload",
          function: `${MODULE_ADDR}::mira::connect_account`,
          arguments: [getRandomizeString(14)],
          type_arguments: [],
        };
        const result = await signAndSubmitTransaction(transaction);
        if (result) {
          // setCreatedMiraAccount(true);
        }
      };

      createMiraAccount();
    }
  }, [walletConnected, walletAddress, signAndSubmitTransaction]);

  return (
    <Flex
      row
      spaceBetween
      alignCenter
      bg={"#222129"}
      p={"10px 40px"}
      borderBottom={"1px solid #333334"}
      gridGap={"16px"}
    >
      <Box
        cursor={"pointer"}
        onClick={() => {
          navigate("/");
        }}
      >
        <Image
          src={`https://i.ibb.co/vBg4ryx/mira-logo-text-white-1.png" alt="mira-logo-text-white-1`}
          width={200}
          margin={0}
          padding={0}
        />
        Beta
      </Box>
      {/* && createdMiraAccount */}
      <ArtButton ml={"auto"} padding={"0px"}>
        <CustomSelect
          onChange={(e) => {
            setCurrentChain(e);
          }}
        >
          {CHAIN_LIST.map((item, index) => {
            return (
              <SmOption
                key={index}
                selected={item == currentChain ? true : false}
                value={item}
              >
                {item}
              </SmOption>
            );
          })}
        </CustomSelect>
      </ArtButton>
      {walletConnected ? (
        <Flex
          center
          // background={"linear-gradient(90deg, #131313, #2b2b2b)"}
          borderRadius={"100%"}
          width={"40px"}
          height={"40px"}
          border={"3px solid #272c2e"}
          cursor={"pointer"}
          onClick={() => {
            navigate("/profile");
          }}
        >
          <UserIcon size={"70%"} />
        </Flex>
      ) : (
        <></>
      )}
      <ArtButton
        // btnColor={walletConnected ? "#0d3d3b" : "#000000"}
        color={walletConnected ? "#74bd7b" : "green"}
        onClick={() => {
          walletConnected ? walletDisconnect() : openConnectModal();
        }}
      >
        {walletConnected
          ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : "Connect Wallet"}
      </ArtButton>
    </Flex>
  );
};

export default LayoutHeader;
