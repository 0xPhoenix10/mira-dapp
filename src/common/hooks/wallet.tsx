import { WalletProviderContext } from "providers/provider.wallet";
import { useContext } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";

export const useWalletHook = () => {
  const {
    disconnect,
    connect,
    connected,
    account,
    select,
    signAndSubmitTransaction,
    wallet,
  } = useWallet();
  const { setOpenConnectModal } = useContext(WalletProviderContext);

  const HandleOpenConnectModal = () => {
    setOpenConnectModal(true);
  };
  return {
    openConnectModal: HandleOpenConnectModal,
    walletDisconnect: disconnect,
    walletSelect: select,
    walletConnect: connect,
    walletConnected: connected,
    walletAddress: account?.address as string,
    signAndSubmitTransaction: signAndSubmitTransaction,
    wallet: wallet,
  };
};
