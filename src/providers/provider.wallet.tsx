import React, {createContext, useEffect, useRef, useState} from "react";
import {
    MartianWalletAdapter,
    PontemWalletAdapter,
    useWallet,
    WalletAdapter,
    WalletProvider
} from "@manahippo/aptos-wallet-adapter";
import {Box, Image} from "../components/base";
import {useWalletHook} from "../common/hooks/wallet";



export const WalletProviderContext = createContext<any>(null);
type LayoutProviderProps = {
    children?: React.ReactNode
};

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
   const [openedConnectModal, setOpenConnectModal] = useState(false);

  return (
      <WalletProviderContext.Provider value = {{setOpenConnectModal: setOpenConnectModal }}>
          {openedConnectModal && <WalletConnectModal setOpenConnectModal = {setOpenConnectModal}  /> }
        {children}
      </WalletProviderContext.Provider>
  );
};

const WalletConnectModal: React.FC<{ setOpenConnectModal: any }> = ({setOpenConnectModal}) =>{
    const {walletConnect} = useWalletHook();
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

    return(
        <Box position={"fixed"} top={"0px"} left={"0px"} bg={"#0005"} width={"100%"} height={"100%"} display={"flex"} zIndex={"1111111"} ref={ModalBack}>
            <Box margin={"auto"} bg={"white"} padding={"32px"} borderRadius={"16px"} display={"flex"} flexDirection={"column"} gridGap={"32px"} alignItems={"center"}>
                <Box fontSize={"18px"} fontWeight={"700"} color={"#0B181F"}>
                    Connect to a wallet
                </Box>
                <Box display={"flex"} flexDirection={"column"} gridGap={"16px"}>
                    <Box
                        bg={"darkBlueBlack"}
                        padding={"24px 32px"}
                        borderRadius={"16px"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        gridGap={"32px"}
                        cursor={"pointer"}
                        onClick={async () => {
                            setOpenConnectModal(false);
                            await walletConnect("Martian");
                        }}
                    >
                        Martian Wallet
                        <Box display={"flex"}>
                            <Image src={require("assets/icon/martian.jpg")} width={"2em"} />
                        </Box>
                    </Box>
                    <Box
                        bg={"darkBlueBlack"}
                        padding={"24px 32px"}
                        borderRadius={"16px"}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        gridGap={"32px"}
                        cursor={"pointer"}
                        onClick={async () => {
                            setOpenConnectModal(false);
                            await walletConnect("Pontem");
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
    )
}


export default LayoutProvider;
