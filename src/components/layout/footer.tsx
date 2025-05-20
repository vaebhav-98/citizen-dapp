
export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p>Citizen Registry dApp - Sepolia Testnet</p>
          <p className="mt-1">
            <a 
              href="https://sepoliafaucet.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Get Sepolia ETH
            </a> | 
            <a 
              href="https://sepolia.etherscan.io/address/0xA011799d9467D2b33768Fb1a3512f1b468B87E96" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary ml-2"
            >
              View Contract on Etherscan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
