
import { useBlockchain } from "@/hooks/use-blockchain";
import { Citizen } from "@/types/citizen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function CitizenList() {
  const { citizens, loading, networkInfo, refreshCitizens } = useBlockchain();
  const { isConnected, isCorrectNetwork } = networkInfo;
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [filteredCitizens, setFilteredCitizens] = useState<Citizen[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCitizens(citizens);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCitizens(
        citizens.filter(
          (citizen) =>
            citizen.name.toLowerCase().includes(query) ||
            citizen.city.toLowerCase().includes(query) ||
            citizen.id.toString().includes(query)
        )
      );
    }
  }, [searchQuery, citizens]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCitizens();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  if (!isConnected) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Citizen Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to view the citizen registry.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Citizen Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Please switch to Sepolia Test Network to view the citizen registry.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Citizen Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading citizens from blockchain...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Citizen Registry</CardTitle>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search citizens..."
                className="px-3 py-1 border rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCitizens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No citizens found matching your search." : "No citizens found in the registry."}
              </p>
              {!searchQuery && (
                <Button onClick={handleRefresh} variant="outline" className="mt-4">
                  Refresh List
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCitizens.map((citizen) => (
                <div
                  key={citizen.id}
                  className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCitizen(citizen)}
                >
                  <div className="p-4">
                    <h3 className="font-medium">{citizen.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>ID: {citizen.id}</p>
                      <p>Age: {citizen.age}</p>
                      <p>City: {citizen.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCitizen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-semibold mb-4">Citizen Details</h2>

            <div className="space-y-3">
              <div>
                <span className="font-medium">ID:</span> {selectedCitizen.id}
              </div>
              <div>
                <span className="font-medium">Name:</span> {selectedCitizen.name}
              </div>
              <div>
                <span className="font-medium">Age:</span> {selectedCitizen.age}
              </div>
              <div>
                <span className="font-medium">City:</span> {selectedCitizen.city}
              </div>
              {selectedCitizen.someNote && (
                <div>
                  <span className="font-medium">Notes:</span> {selectedCitizen.someNote}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedCitizen(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
