
import { CitizenList } from "@/components/citizen-list";
import { Web3Status } from "@/components/web3-status";
import { MainLayout } from "@/components/layouts/main-layout";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Citizen Registry</h1>
          <p className="text-muted-foreground">
            View and manage citizens on the Sepolia blockchain testnet
          </p>
        </div>
        
        <Web3Status />
        <CitizenList />
      </div>
    </MainLayout>
  );
};

export default Index;
