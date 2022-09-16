import { useWalletHook } from "common/hooks/wallet";
import { Box } from "components/base";
import { Flex } from "components/base/container";
import { ArtButton } from "components/elements/buttons";
import { UserIcon } from "components/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MODULE_ADDR, NODE_URL } from "config";
import { AptosClient } from "aptos";
const LayoutHeader = () => {
  const navigate = useNavigate();
  const { walletConnected, openConnectModal, walletAddress,  walletDisconnect, signAndSubmitTransaction} = useWalletHook();
  const [ createdMiraAccount, setCreatedMiraAccount ] = useState<boolean>(false);
  useEffect(()=>{
    if (walletConnected){
      createMiraAccount();
    }
  },[walletConnected])
  const createMiraAccount = async () =>{
    const client = new AptosClient(NODE_URL);
    try {
      let resource = await client.getAccountResource(walletAddress, `${MODULE_ADDR}::mira::MiraAccount`);
      if (resource){
        setCreatedMiraAccount(true);
        return;
      }
    }catch(error){
    }

    const transaction = {
      type: 'entry_function_payload',
      function: `${MODULE_ADDR}::mira::connect_account`,
      arguments:[],
      type_arguments:[]
    };
    const result = await signAndSubmitTransaction(transaction);
    if (result){
      setCreatedMiraAccount(true);
    }
  }
  return (
    <Flex
      row
      spaceBetween
      alignCenter
      p={"10px 40px"}
      borderBottom={"1px solid #1e2022"}
      gridGap={"16px"}
    >
      <Box
        background={"linear-gradient(-90deg, #c7c7c7, #c7c7c7)"}
        fontFamily={"inherit"}
        fontSize={"28px"}
        fontWeight={"bold"}
        color={"transparent"}
        style={{ WebkitBackgroundClip: "text" }}
        cursor={"pointer"}
        onClick={() => {
          navigate("/");
        }}
      >
        Mira Finance
      </Box>
      {walletConnected && createdMiraAccount ? (
        <Flex
          center
          ml={"auto"}
          background={"linear-gradient(90deg, #131313, #2b2b2b)"}
          borderRadius={"100%"}
          width={"40px"}
          height={"40px"}
          border={"3px solid #272c2e"}
          boxShadow={"-5px -3px 10px 0px #fff2, 5px 3px 10px 0px #0006"}
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
        btnColor={walletConnected ? "#0d3d3b" : "#000000"}
        color={walletConnected ? "#74bd7b" : "green"}
        onClick={() => {
          walletConnected ? walletDisconnect():openConnectModal();
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
