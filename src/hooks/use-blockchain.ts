
import { useState, useEffect, useCallback } from 'react';
import { getWeb3, getCitizens, addCitizen } from '@/lib/web3/contract';
import type { Citizen, CitizenFormData } from '@/types/citizen';
import { toast } from "sonner";

type NetworkInfo = {
  chainId: string;
  networkName: string;
  isConnected: boolean;
  address: string;
  isCorrectNetwork: boolean;
};

const SEPOLIA_CHAIN_ID = '0xaa36a7';  // Chain ID for Sepolia in hex

export function useBlockchain() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    chainId: '',
    networkName: '',
    isConnected: false,
    address: '',
    isCorrectNetwork: false
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshCitizens = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    return new Promise<void>((resolve) => {
      // Allow UI to show loading state
      setTimeout(resolve, 500);
    });
  }, []);

  const fetchNetworkInfo = useCallback(async () => {
    try {
      const web3 = await getWeb3();
      const chainId = await web3.eth.getChainId();
      const chainIdHex = `0x${chainId.toString(16)}`;
      const accounts = await web3.eth.getAccounts();
      
      let networkName = 'Unknown Network';
      if (chainIdHex === SEPOLIA_CHAIN_ID) {
        networkName = 'Sepolia Test Network';
      } else if (chainIdHex === '0x1') {
        networkName = 'Ethereum Mainnet';
      } else if (chainIdHex === '0x5') {
        networkName = 'Goerli Test Network';
      }
      
      setNetworkInfo({
        chainId: chainIdHex,
        networkName,
        isConnected: accounts.length > 0,
        address: accounts[0] || '',
        isCorrectNetwork: chainIdHex === SEPOLIA_CHAIN_ID
      });
      
      if (chainIdHex !== SEPOLIA_CHAIN_ID && accounts.length > 0) {
        toast.warning("Please connect to Sepolia Test Network to interact with this dApp");
      }
    } catch (error) {
      console.error("Error fetching network info:", error);
      setNetworkInfo({
        chainId: '',
        networkName: 'Not Connected',
        isConnected: false,
        address: '',
        isCorrectNetwork: false
      });
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected. Please install MetaMask to use this dApp");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await fetchNetworkInfo();
      refreshCitizens();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  }, [fetchNetworkInfo, refreshCitizens]);

  const switchToSepolia = useCallback(async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected");
        return;
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
      
      await fetchNetworkInfo();
      refreshCitizens();
    } catch (error) {
      console.error("Error switching to Sepolia:", error);
      toast.error("Failed to switch to Sepolia Test Network");
    }
  }, [fetchNetworkInfo, refreshCitizens]);

  const submitCitizen = useCallback(async (data: CitizenFormData) => {
    try {
      setLoading(true);
      await addCitizen(data);
      toast.success("Citizen added successfully!");
      refreshCitizens();
    } catch (error) {
      console.error("Error submitting citizen:", error);
      toast.error("Failed to add citizen. Please check console for details.");
    } finally {
      setLoading(false);
    }
  }, [refreshCitizens]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        setLoading(true);
        await fetchNetworkInfo();
        
        if (window.ethereum && networkInfo.isConnected && networkInfo.isCorrectNetwork) {
          const loadedCitizens = await getCitizens();
          setCitizens(loadedCitizens);
        }
      } catch (error) {
        console.error("Error loading blockchain data:", error);
        toast.error("Failed to load citizens data");
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, [fetchNetworkInfo, networkInfo.isConnected, networkInfo.isCorrectNetwork, refreshTrigger]);

  return {
    citizens,
    loading,
    networkInfo,
    connectWallet,
    switchToSepolia,
    submitCitizen,
    refreshCitizens
  };
}
