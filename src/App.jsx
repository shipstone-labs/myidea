import { initSatellite } from "@junobuild/core";
import { useEffect } from "react";
import { Auth } from "./components/Auth";
import { Background } from "./components/Background";
import { Footer } from "./components/Footer";
import { FaLightbulb } from "react-icons/fa";
import { MainView } from "./components/MainView";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { config } from "./providers";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { WagmiProvider, deserialize, serialize } from "wagmi";
import { Account, Connect, SwitchAccount } from "./components/Network";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: { networkMode: "offlineFirst" },
  },
});

const persister = createSyncStoragePersister({
  key: "vite-react.cache",
  serialize,
  storage: window.localStorage,
  deserialize,
});

function App() {
  useEffect(() => {
    (async () =>
      await initSatellite({
        workers: {
          auth: true,
        },
      }))();
  }, []);

  return (
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <div className="relative isolate min-h-[100dvh]">
          <Account />
          <Connect />
          <SwitchAccount />
          <main className="mx-auto max-w-screen-2xl py-16 px-8 md:px-24 tall:min-h-[calc(100dvh-128px)]">
            <h1 className="dark:text-white text-5xl md:text-6xl font-bold tracking-tight md:pt-24">
              <FaLightbulb className="inline-block align-middle" /> MyIdea
            </h1>
            <p className="dark:text-white py-4 md:max-w-lg">
              defining patent claims by the nanosecond
            </p>

            <Auth>
              <MainView />
            </Auth>
          </main>

          <Footer />

          <Background />
        </div>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
