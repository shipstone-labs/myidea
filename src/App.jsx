import { initSatellite } from "@junobuild/core";
import { useEffect } from "react";
import { Auth } from "./components/Auth";
import { Background } from "./components/Background";
import { Footer } from "./components/Footer";
import { FaLightbulb } from "react-icons/fa";
import { MainView } from "./components/MainView";

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
    <>
      <div className="relative isolate min-h-[100dvh]">
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
    </>
  );
}

export default App;
