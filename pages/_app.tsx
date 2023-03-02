import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useWeb3Login } from "./web3login";
import Header from "./Header";

function App({ Component, pageProps }: AppProps) {
  const {
    authStatus,
    RainbowKitProvider,
    RainbowKitAuthenticationProvider,
    WagmiConfig,
    dittiAppInfo,
    authAdapter,
    wagmiClient,
  } = useWeb3Login();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authAdapter}
        status={authStatus}
      >
        <RainbowKitProvider appInfo={dittiAppInfo} chains={dittiAppInfo.chains}>
          <Header />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default App;
