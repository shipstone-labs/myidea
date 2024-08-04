import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { http } from "viem";
import { lukso } from "wagmi/chains";

export const chains = [lukso];

export const config = defaultWagmiConfig({
  chains,
  multiInjectedProviderDiscovery: true,
  transports: {
    [lukso.id]: http(),
  },
  // projectId: feature.walletConnect.projectId,
  metadata: {
    name: "MyIdea",
    description:
      "MyIdea is a decentralized application for defining patent claims by the nanosecond",
    url: "https://myidea.shipstone.com",
    icons: ["https://myidea.shipstone.com/favicon-32x32.png"],
  },
  enableEmail: true,
  ssr: true,
});
