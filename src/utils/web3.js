import { ethers } from 'ethers';
import TrustWorkABI from '../artifacts/contracts/TrustWork.sol/TrustWork.json';

let provider;
let signer;
let contract;

export const connectWallet = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    // Get contract info
    const contractInfo = await import('../contract-info.json');
    const contractAddress = contractInfo.address;
    
    // Create contract instance
    contract = new ethers.Contract(contractAddress, TrustWorkABI.abi, signer);

    return {
      address: accounts[0],
      provider,
      signer,
      contract
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const getContract = () => {
  if (!contract) {
    throw new Error('Contract not initialized. Please connect wallet first.');
  }
  return contract;
};

export const getSigner = () => {
  if (!signer) {
    throw new Error('Signer not initialized. Please connect wallet first.');
  }
  return signer;
};

export const formatEther = (wei) => {
  return ethers.formatEther(wei);
};

export const parseEther = (ether) => {
  return ethers.parseEther(ether);
};

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getJobStatus = (status) => {
  const statuses = {
    0: 'Created',
    1: 'Accepted', 
    2: 'Delivered',
    3: 'Completed',
    4: 'Disputed',
    5: 'Cancelled'
  };
  return statuses[status] || 'Unknown';
};

export const getJobStatusColor = (status) => {
  const colors = {
    0: 'bg-blue-100 text-blue-800',
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-purple-100 text-purple-800', 
    3: 'bg-green-100 text-green-800',
    4: 'bg-red-100 text-red-800',
    5: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}; 