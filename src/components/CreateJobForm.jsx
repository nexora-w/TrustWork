'use client';

import { useState } from 'react';
import { useWeb3 } from '../context/Web3Provider';
import { parseEther } from '../utils/web3';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateJobForm({ onJobCreated, onClose }) {
  const { contract, account } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    freelancer: '',
    title: '',
    description: '',
    amount: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate form data
      if (!formData.freelancer || !formData.title || !formData.description || !formData.amount || !formData.deadline) {
        toast.error('Please fill in all fields');
        return;
      }

      // Validate freelancer address
      if (!/^0x[a-fA-F0-9]{40}$/.test(formData.freelancer)) {
        toast.error('Please enter a valid Ethereum address');
        return;
      }

      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      // Validate deadline
      const deadline = new Date(formData.deadline).getTime() / 1000;
      if (deadline <= Date.now() / 1000) {
        toast.error('Deadline must be in the future');
        return;
      }

      // Convert amount to wei
      const amountInWei = parseEther(formData.amount);

      // Create job transaction
      const tx = await contract.createJob(
        formData.freelancer,
        formData.title,
        formData.description,
        deadline,
        { value: amountInWei }
      );

      toast.promise(tx.wait(), {
        loading: 'Creating job...',
        success: 'Job created successfully!',
        error: 'Failed to create job'
      });

      await tx.wait();
      
      // Reset form
      setFormData({
        freelancer: '',
        title: '',
        description: '',
        amount: '',
        deadline: ''
      });

      onJobCreated?.();
      onClose?.();
      
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Freelancer Address
            </label>
            <input
              type="text"
              name="freelancer"
              value={formData.freelancer}
              onChange={handleInputChange}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter job title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the job requirements..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.01"
              step="0.001"
              min="0.001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>{isSubmitting ? 'Creating...' : 'Create Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 