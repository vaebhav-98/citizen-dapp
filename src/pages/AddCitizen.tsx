
import { CitizenForm } from "@/components/citizen-form";
import { Web3Status } from "@/components/web3-status";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AddCitizen = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New Citizen</h1>
        </div>
        
        <Web3Status />
        <CitizenForm />
      </div>
    </MainLayout>
  );
};

export default AddCitizen;
