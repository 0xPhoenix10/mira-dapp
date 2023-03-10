import React, { createContext, useEffect, useRef, useState } from "react";
import { Box, Image } from "../components/base";
import { useWalletHook } from "../common/hooks/wallet";
import { WalletName } from "@manahippo/aptos-wallet-adapter";

export const WalletProviderContext = createContext<any>(null);
type LayoutProviderProps = {
  children?: React.ReactNode;
};

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [openedConnectModal, setOpenConnectModal] = useState(false);

  return (
    <WalletProviderContext.Provider
      value={{ setOpenConnectModal: setOpenConnectModal }}
    >
      {openedConnectModal && (
        <WalletConnectModal setOpenConnectModal={setOpenConnectModal} />
      )}
      {children}
    </WalletProviderContext.Provider>
  );
};

const WalletConnectModal: React.FC<{ setOpenConnectModal: any }> = ({
  setOpenConnectModal,
}) => {
  const { walletSelect } = useWalletHook();
  const ModalBack = useRef(null);

  const handleModalClose = (e: any) => {
    if (ModalBack.current !== e.target) return;
    setOpenConnectModal(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleModalClose);
    return () => {
      window.removeEventListener("click", handleModalClose);
    };
  });

  return (
    <Box
      position={"fixed"}
      top={"0px"}
      left={"0px"}
      bg={"#0005"}
      width={"100%"}
      height={"100%"}
      display={"flex"}
      zIndex={"1111111"}
      ref={ModalBack}
    >
      <Box
        margin={"auto"}
        bg={"#222129"}
        padding={"32px"}
        border={"1px solid #34383b"}
        borderRadius={"16px"}
        display={"flex"}
        flexDirection={"column"}
        gridGap={"32px"}
        alignItems={"center"}
      >
        <Box fontSize={"18px"} fontWeight={"700"} color={"white"}>
          Connect to a wallet
        </Box>
        <Box display={"flex"} flexDirection={"column"} gridGap={"16px"}>
          <Box
            bg={"#302D38"}
            padding={"24px 32px"}
            borderRadius={"16px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gridGap={"32px"}
            cursor={"pointer"}
            onClick={async () => {
              setOpenConnectModal(false);
              await walletSelect("Martian" as WalletName);
            }}
          >
            Martian Wallet
            <Box display={"flex"}>
              <Image src={require("assets/icon/martian.jpg")} width={"2em"} />
            </Box>
          </Box>
          <Box
            bg={"#302D38"}
            padding={"24px 32px"}
            borderRadius={"16px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gridGap={"32px"}
            cursor={"pointer"}
            onClick={async () => {
              setOpenConnectModal(false);
              await walletSelect("Pontem" as WalletName);
            }}
          >
            Pontem Wallet
            <Box display={"flex"}>
              <Image src={require("assets/icon/pontem.jpg")} width={"2em"} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutProvider;
