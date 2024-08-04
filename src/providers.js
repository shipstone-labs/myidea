import { http, createConfig } from "wagmi";
import { lukso } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [lukso],
  connectors: [
    walletConnect({
      projectId: "205bd79347ff59d91896c6e2e36f8ee3",
    }),
    coinbaseWallet(),
    metaMask(),
  ],
  transports: {
    [lukso.id]: http(),
  },
});
