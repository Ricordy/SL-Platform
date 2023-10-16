import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { AppType } from "next/dist/shared/lib/utils";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { api } from "~/utils/api";
import Layout from "../components/Layout";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

const alchemyApiKey = process.env.ALCHEMY_API_KEY as string;
const infuraApiKey = process.env.INFURA_API_KEY as string;
const jsonRpcUrl =
  process.env.NEXT_PUBLIC_JSONRPC_URL ??
  "https://eth-goerli.g.alchemy.com/v2/zEaTIrJiR65rZT3KOR7w9ObTjHhr_TFb";

const { chains, provider } = configureChains(
  [
    goerli,
    // hardhat
  ],
  [
    // publicProvider({ priority: 1 }),
    // alchemyProvider({ apiKey: alchemyApiKey, priority: 0 }),
    // infuraProvider({ apiKey: infuraApiKey }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: jsonRpcUrl,
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
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
    <>
      <WagmiConfig client={client}>
        <SessionProvider session={session as Session}>
          {/* <ConnectKitProvider> */}
          <Layout>{isMounted && <Component {...pageProps} />}</Layout>
          {/* </ConnectKitProvider> */}
        </SessionProvider>
      </WagmiConfig>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
