import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { lukso } from "viem/chains";

const projectId = "205bd79347ff59d91896c6e2e36f8ee3";

// 2. Create wagmiConfig
const metadata = {
  name: "MyIdea",
  description:
    "MyIdea is a decentralized application for defining patent claims by the nanosecond.",
};

export const chains = [lukso];
export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });
