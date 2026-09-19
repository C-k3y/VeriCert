import { createConfig, http } from "wagmi";
import { sepolia, foundry } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as
  | string
  | undefined;

// foundry === chainId 31337, matches the local Anvil node used by `forge script` during development.
export const supportedChains = [sepolia, foundry] as const;

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [
    injected(), // MetaMask, Rabby, Frame, any EIP-1193 browser wallet
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: false })]
      : []),
  ],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_RPC_URL || undefined),
    [foundry.id]: http("http://127.0.0.1:8545"),
  },
  ssr: false,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
