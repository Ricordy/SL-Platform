import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import Layout from "../components/Layout";
import { WagmiConfig, createClient, mainnet } from "wagmi";
import { goerli, hardhat } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { useEffect, useState } from "react";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const client = createClient(
  getDefaultClient({
    appName: "Something Legendary",
    alchemyId,
    chains: [mainnet, goerli, hardhat],
  })
);

const MyApp: AppType = ({ Component, pageProps }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Layout>{isMounted && <Component {...pageProps} />}</Layout>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;
