import { initSatellite } from "@junobuild/core";
import { useEffect } from "react";
import { Auth } from "./components/Auth";
import { Background } from "./components/Background";
import { Footer } from "./components/Footer";
import { FaLightbulb } from "react-icons/fa";
import { MainView } from "./components/MainView";
import { WagmiConfig } from "wagmi";
import { config } from "./providers";
import Profile from "./components/Profile";

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
    <WagmiConfig client={config}>
      <div className="relative isolate min-h-[100dvh]">
        <main className="mx-auto max-w-screen-2xl py-16 px-8 md:px-24 tall:min-h-[calc(100dvh-128px)]">
          <Profile />
          <h1 className="dark:text-white text-5xl md:text-6xl font-bold tracking-tight md:pt-24">
            <FaLightbulb className="inline-block align-middle" /> MyIdea
          </h1>
          <p className="dark:text-white py-4 md:max-w-lg">
            defining patent claims by the nanosecond
          </p>

          <Auth>
            <Profile />
            <MainView />
          </Auth>
        </main>

        <Footer />

        <Background />
      </div>
    </WagmiConfig>
  );
}

export default App;
