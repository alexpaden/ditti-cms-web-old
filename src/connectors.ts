import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { configureChains, createClient } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

const chains = [arbitrum, mainnet, polygon];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: process.env.REACT_APP_WC_PROJ_ID! }),
]);
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: process.env.REACT_APP_WC_PROJ_ID,
    version: "2", // or "2"
    appName: "web3Modal",
    chains,
  }),
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
