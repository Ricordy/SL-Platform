import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { WagmiConfig, configureChains, createClient, mainnet } from "wagmi";
import { goerli, hardhat } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { api } from "~/utils/api";
import { publicProvider } from "wagmi/providers/public";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const { provider } = configureChains(
  [mainnet, goerli, hardhat],
  [
    publicProvider(),
    // alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY as string }),
  ]
);

const client = createClient({
  autoConnect: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  provider,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <WagmiConfig client={client}>
      <SessionProvider session={session}>
        {/* <ConnectKitProvider> */}
        <Layout>{isMounted && <Component {...pageProps} />}</Layout>
        {/* </ConnectKitProvider> */}
      </SessionProvider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
