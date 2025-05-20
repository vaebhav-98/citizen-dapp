
import Web3 from 'web3';
import type { Citizen, CitizenFormData } from '@/types/citizen';
import { toast } from "sonner";

// Contract ABI
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "Citizen",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "someNote",
        "type": "string"
      }
    ],
    "name": "addCitizen",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getNoteByCitizenId",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address on Sepolia testnet
const CONTRACT_ADDRESS = '0xA011799d9467D2b33768Fb1a3512f1b468B87E96';

// Web3 instance
let web3Instance: Web3 | null = null;
let contractInstance: any = null;

export const getWeb3 = async (): Promise<Web3> => {
  if (web3Instance) return web3Instance;

  if (window.ethereum) {
    web3Instance = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error("User denied account access");
      toast.error("User denied account access. Please connect to MetaMask to continue.");
      throw new Error("User denied account access");
    }
  } else if (window.web3) {
    // Legacy dapp browsers
    web3Instance = new Web3(window.web3.currentProvider);
  } else {
    toast.error("No Ethereum browser extension detected. Please install MetaMask.");
    throw new Error("No Ethereum browser extension detected");
  }

  return web3Instance;
};

export const getContract = async () => {
  if (contractInstance) return contractInstance;

  const web3 = await getWeb3();
  contractInstance = new web3.eth.Contract(ABI as any, CONTRACT_ADDRESS);
  
  return contractInstance;
};

export const getCitizens = async (): Promise<Citizen[]> => {
  const web3 = await getWeb3();
  const contract = await getContract();
  
  // Get past events
  const pastEvents = await contract.getPastEvents('Citizen', {
    fromBlock: 0,
    toBlock: 'latest'
  });

  const citizens: Citizen[] = await Promise.all(pastEvents.map(async (event: any) => {
    const { id, age, city, name } = event.returnValues;
    let someNote = '';
    
    try {
      someNote = await contract.methods.getNoteByCitizenId(id).call();
    } catch (error) {
      console.error(`Error fetching note for citizen ID ${id}:`, error);
    }
    
    // Fix for city encoding
    let formattedCity = city;
    try {
      // Handle both direct string values and hex values
      if (typeof city === 'string' && city.startsWith('0x')) {
        formattedCity = web3.utils.hexToUtf8(city);
      } else if (typeof city === 'string' && !city.startsWith('0x')) {
        // Try to handle raw hex strings without 0x prefix
        try {
          formattedCity = web3.utils.hexToUtf8(`0x${city}`);
        } catch (e) {
          // If error, just use the original city string
          formattedCity = city;
        }
      }
    } catch (error) {
      console.error(`Error decoding city for citizen ID ${id}:`, error);
      formattedCity = city; // Fall back to original value
    }
    
    return {
      id: Number(id),
      age: Number(age),
      city: formattedCity,
      name,
      someNote
    };
  }));
  
  return citizens;
};

export const addCitizen = async (citizen: CitizenFormData): Promise<void> => {
  const web3 = await getWeb3();
  const contract = await getContract();
  const accounts = await web3.eth.getAccounts();
  
  if (!accounts || accounts.length === 0) {
    toast.error("No Ethereum accounts available. Please connect your wallet.");
    throw new Error("No Ethereum accounts available");
  }
  
  try {
    await contract.methods.addCitizen(
      citizen.age,
      citizen.city,
      citizen.name,
      citizen.someNote
    ).send({ from: accounts[0] });
    
    toast.success("Citizen added successfully!");
  } catch (error) {
    console.error("Error adding citizen:", error);
    toast.error("Failed to add citizen. Check the console for details.");
    throw error;
  }
};

// Add event listeners for Metamask
if (typeof window !== 'undefined') {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      // Reset web3 instance when accounts change
      web3Instance = null;
      contractInstance = null;
      window.location.reload();
    });

    window.ethereum.on('chainChanged', () => {
      // Reset web3 instance when network changes
      web3Instance = null;
      contractInstance = null;
      window.location.reload();
    });
  }
}
