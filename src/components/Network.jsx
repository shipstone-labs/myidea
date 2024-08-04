import {
  useAccount,
  // useAccountEffect,
  // useBalance,
  // useBlockNumber,
  useChainId,
  useConnect,
  // useConnections,
  // useConnectorClient,
  useDisconnect,
  useEnsName,
  // useReadContract,
  // useReadContracts,
  // useSendTransaction,
  // useSignMessage,
  useSwitchAccount,
  // useSwitchChain,
  // useWaitForTransactionReceipt,
  // useWriteContract,
} from "wagmi";

export function Account() {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({
    address: account.address,
  });

  return (
    <div>
      <h2>Account</h2>

      <div>
        account: {account.address} {ensName}
        <br />
        chainId: {account.chainId}
        <br />
        status: {account.status}
      </div>

      {account.status !== "disconnected" && (
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      )}
    </div>
  );
}

export function Connect() {
  const chainId = useChainId();
  const { connectors, connect, status, error } = useConnect();

  return (
    <div>
      <h2>Connect</h2>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector, chainId })}
          type="button"
        >
          {connector.name}
        </button>
      ))}
      <div>{status}</div>
      <div>{error?.message}</div>
    </div>
  );
}

export function SwitchAccount() {
  const account = useAccount();
  const { connectors, switchAccount } = useSwitchAccount();

  return (
    <div>
      <h2>Switch Account</h2>

      {connectors.map((connector) => (
        <button
          disabled={account.connector?.uid === connector.uid}
          key={connector.uid}
          onClick={() => switchAccount({ connector })}
          type="button"
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
