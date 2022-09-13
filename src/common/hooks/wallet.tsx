import { WalletProviderContext } from "providers/provider.wallet";
import { useContext } from "react";
import {useWallet} from "@manahippo/aptos-wallet-adapter";

export const useWalletHook = () => {
  const { setOpenConnectModal } = useContext(WalletProviderContext);
  const { disconnect, connected,account, signAndSubmitTransaction, wallet } = useWallet();
  
  const HandleOpenConnectModal = () =>{
    setOpenConnectModal(true);
  }
  return {
    openConnectModal: HandleOpenConnectModal,
    walletDisconnect: disconnect,
    walletConnected: connected,
    walletAddress: account?.address as string,
    signAndSubmitTransaction: signAndSubmitTransaction,
    wallet: wallet
  }
};
