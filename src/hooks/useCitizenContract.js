import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, ABI } from '../constants/contract';
import { toast } from 'react-toastify';

export default function useCitizenContract() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [citizens, setCitizens] = useState([]);
    const [form, setForm] = useState({ age: '', city: '', name: '', note: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const wallet_connect = async () => {
            if (!window.ethereum) return toast.error('Please install MetaMask.');

            try {
                const provider = new Web3(window.ethereum);
                setWeb3(provider);

                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await provider.eth.getAccounts();
                setAccount(accounts[0]);

                const instance = new provider.eth.Contract(ABI, CONTRACT_ADDRESS);
                setContract(instance);

                await fetchCitizens(instance);
            } catch (err) {
                console.error('Failed to load contract:', err);
            }
        };

        wallet_connect();
    }, []);

    const fetchCitizens = async (instance) => {
        try {
            const pastEvents = await instance.getPastEvents('Citizen', {
                fromBlock: 0,
                toBlock: 'latest',
            });

            const citizensWithNotes = await Promise.all(
                pastEvents.map(async ({ returnValues }) => {
                    const note = await instance.methods
                        .getNoteByCitizenId(returnValues.id)
                        .call();

                    return {
                        id: returnValues.id,
                        age: returnValues.age,
                        city: returnValues.city,
                        name: returnValues.name,
                        note,
                    };
                })
            );

            setCitizens(citizensWithNotes);
        } catch (err) {
            toast.error('Error fetching citizens:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { age, city, name, note } = form;
      
        if (!contract || !account) {
          toast.error('Contract or account not loaded.');
          setLoading(false);
          return;
        }
      
        try {
          await contract.methods
            .addCitizen(age, city, name, note)
            .send({ from: account })
            .on('receipt', async (receipt) => {
                toast.success('Citizen added successfully.');
              setForm({ age: '', city: '', name: '', note: '' });
              await fetchCitizens();
            })
            .on('error', (err) => {
                toast.error('Transaction failed');
              console.error(err);
            });
        } catch (error) {
            toast.error('Unexpected error during transaction.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      const connectWallet = async () => {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            toast.error('Please install MetaMask or another wallet provider.');
        }
      };
      

    return {
        account,
        citizens,
        form,
        handleChange,
        handleSubmit,
        loading,
        connectWallet
    };
}
