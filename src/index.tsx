import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AllProvider from "./providers";
import {
    MartianWalletAdapter,
    PontemWalletAdapter,
    WalletAdapter,
    WalletProvider
} from "@manahippo/aptos-wallet-adapter";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const wallets: WalletAdapter[] = [
    new MartianWalletAdapter(),
    new PontemWalletAdapter()
];

root.render(
  <React.StrictMode>
      <WalletProvider wallets={wallets} autoConnect={true} onError={(error: Error) => {
          console.log('wallet error:', error)
      }}>
        <AllProvider>
          <App />
        </AllProvider>
      </WalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
