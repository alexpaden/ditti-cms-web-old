import React from "react";
import "./App.css";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig } from "wagmi";
import { ethereumClient, wagmiClient } from "./connectors";
import Home from "./Home";

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Home />
      </WagmiConfig>

      <Web3Modal
        projectId={process.env.REACT_APP_WC_PROJ_ID!}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
