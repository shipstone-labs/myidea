import { createClient, configureChains } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Chain } from "viem";

// Define the LUKSO chain configuration
const luksoChain = {
  id: 2828, // LUKSO L14 Testnet Chain ID
  name: "LUKSO L14",
  network: "lukso",
  nativeCurrency: {
    name: "LYXt",
    symbol: "LYXt",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://rpc.l14.lukso.network",
  },
  blockExplorers: {
    default: {
      name: "LUKSO Explorer",
      url: "https://explorer.execution.l14.lukso.network",
    },
  },
  testnet: true,
};

// Configure chains and providers
const { chains, provider } = configureChains(
  [luksoChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== luksoChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
    publicProvider(),
  ]
);

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: "My LUKSO dApp",
  chains,
});

// Create wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, wagmiClient };
