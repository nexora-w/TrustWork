import { Web3Storage } from 'web3.storage';

// You'll need to get an API token from https://web3.storage
const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

export const uploadToIPFS = async (file) => {
  try {
    if (!WEB3_STORAGE_TOKEN) {
      throw new Error('Web3.Storage token not configured');
    }

    const cid = await client.put([file], {
      name: file.name,
      maxRetries: 3
    });

    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const uploadMultipleToIPFS = async (files) => {
  try {
    if (!WEB3_STORAGE_TOKEN) {
      throw new Error('Web3.Storage token not configured');
    }

    const cid = await client.put(files, {
      maxRetries: 3
    });

    return cid;
  } catch (error) {
    console.error('Error uploading multiple files to IPFS:', error);
    throw error;
  }
};

export const getIPFSGatewayURL = (cid, filename = '') => {
  if (!cid) return '';
  
  // Use multiple gateways for redundancy
  const gateways = [
    `https://${cid}.ipfs.dweb.link/${filename}`,
    `https://ipfs.io/ipfs/${cid}/${filename}`,
    `https://gateway.pinata.cloud/ipfs/${cid}/${filename}`
  ];
  
  return gateways[0]; // Return first gateway, fallback can be implemented
};

export const downloadFromIPFS = async (cid, filename = '') => {
  try {
    const url = getIPFSGatewayURL(cid, filename);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error downloading from IPFS:', error);
    throw error;
  }
};

export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (file.size > maxSize) {
    throw new Error('File size exceeds 50MB limit');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not supported');
  }

  return true;
}; 