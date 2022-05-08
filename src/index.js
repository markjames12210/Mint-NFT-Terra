import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider";
import "react-notifications/lib/notifications.css";

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <React.StrictMode>
      <WalletProvider {...chainOptions}>
        <App />
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
