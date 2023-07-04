import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { AppType } from "next/dist/shared/lib/utils";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { api } from "~/utils/api";
import Layout from "../components/Layout";
import "../styles/globals.css";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;

const { provider } = configureChains(
  [polygonMumbai],
  [
    // publicProvider(),
    alchemyProvider({ apiKey: alchemyId }),
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
