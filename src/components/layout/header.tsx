
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/hooks/use-blockchain";
import { Link } from "react-router-dom";

export function Header() {
  const { networkInfo, connectWallet } = useBlockchain();
  const { isConnected, address } = networkInfo;

  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Citizen Registry
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/add" className="font-medium hover:text-primary">
            Add Citizen
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <Button onClick={connectWallet} size="sm">
              Connect Wallet
            </Button>
          ) : (
            <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
