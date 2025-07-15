'use client';

import { useState } from 'react';
import { useWeb3 } from '../context/Web3Provider';
import { formatEther, shortenAddress, getJobStatus, getJobStatusColor } from '../utils/web3';
import { Clock, User, DollarSign, Calendar, CheckCircle, XCircle, AlertTriangle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function JobCard({ job, onUpdate }) {
  const { contract, account } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const isClient = job.client === account;
  const isFreelancer = job.freelancer === account;
  const canAccept = isFreelancer && job.status === 0; // Created
  const canDeliver = isFreelancer && job.status === 1; // Accepted
  const canConfirm = isClient && job.status === 2; // Delivered
  const canCancel = isClient && job.status === 0; // Created
  const canDispute = (isClient || isFreelancer) && (job.status === 1 || job.status === 2);

  const handleAcceptJob = async () => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contract.acceptJob(job.id);
      
      toast.promise(tx.wait(), {
        loading: 'Accepting job...',
        success: 'Job accepted successfully!',
        error: 'Failed to accept job'
      });

      await tx.wait();
      onUpdate?.();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error(error.message || 'Failed to accept job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contract.confirmDelivery(job.id);
      
      toast.promise(tx.wait(), {
        loading: 'Confirming delivery...',
        success: 'Delivery confirmed! Payment released.',
        error: 'Failed to confirm delivery'
      });

      await tx.wait();
      onUpdate?.();
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error(error.message || 'Failed to confirm delivery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelJob = async () => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const tx = await contract.cancelJob(job.id);
      
      toast.promise(tx.wait(), {
        loading: 'Cancelling job...',
        success: 'Job cancelled successfully!',
        error: 'Failed to cancel job'
      });

      await tx.wait();
      onUpdate?.();
    } catch (error) {
      console.error('Error cancelling job:', error);
      toast.error(error.message || 'Failed to cancel job');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatDeadline = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{job.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
          {getJobStatus(job.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <DollarSign size={16} className="text-gray-400" />
          <span className="text-gray-600">
            {formatEther(job.amount)} ETH
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-gray-600">
            Due: {formatDeadline(job.deadline)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <span className="text-gray-600">
            Client: {shortenAddress(job.client)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <span className="text-gray-600">
            Freelancer: {shortenAddress(job.freelancer)}
          </span>
        </div>
      </div>

      {job.ipfsHash && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center space-x-2">
            <Upload size={16} className="text-blue-500" />
            <span className="text-sm text-blue-700">Deliverables uploaded</span>
          </div>
          <a 
            href={`https://ipfs.io/ipfs/${job.ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View on IPFS
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {canAccept && (
          <button
            onClick={handleAcceptJob}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <CheckCircle size={16} />
            <span>Accept Job</span>
          </button>
        )}

        {canDeliver && (
          <Link
            href={`/deliver/${job.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Deliver Work</span>
          </Link>
        )}

        {canConfirm && (
          <button
            onClick={handleConfirmDelivery}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <CheckCircle size={16} />
            <span>Confirm Delivery</span>
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancelJob}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <XCircle size={16} />
            <span>Cancel Job</span>
          </button>
        )}

        {canDispute && (
          <Link
            href={`/dispute/${job.id}`}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <AlertTriangle size={16} />
            <span>Raise Dispute</span>
          </Link>
        )}

        <Link
          href={`/job/${job.id}`}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
} 