
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/hooks/use-blockchain";

export function Web3Status() {
  const { networkInfo, connectWallet, switchToSepolia } = useBlockchain();
  const { isConnected, address, networkName, isCorrectNetwork } = networkInfo;

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h3 className="font-medium text-lg">Wallet Status</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Network:</span>{" "}
            <span className={isCorrectNetwork ? "text-green-500" : "text-red-500"}>
              {networkName}
            </span>
          </div>
          {isConnected && (
            <div>
              <span className="font-medium">Address:</span>{" "}
              <span className="font-mono">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-3">
        {!isConnected ? (
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : !isCorrectNetwork ? (
          <Button onClick={switchToSepolia} variant="secondary">
            Switch to Sepolia
          </Button>
        ) : null}
      </div>
    </div>
  );
}
