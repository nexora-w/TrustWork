'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Provider';
import Header from '../components/Header';
import CreateJobForm from '../components/CreateJobForm';
import JobCard from '../components/JobCard';
import { Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobBoard() {
  const { contract, account, isConnected } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchJobs = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const jobIds = [];
      
      // Get all job IDs by checking recent events
      // For demo purposes, we'll check jobs 1-50
      for (let i = 1; i <= 50; i++) {
        try {
          const job = await contract.getJob(i);
          if (job.client !== '0x0000000000000000000000000000000000000000') {
            jobIds.push(i);
          }
        } catch (error) {
          // Job doesn't exist, continue
          break;
        }
      }

      // Fetch job details
      const jobPromises = jobIds.map(async (id) => {
        const job = await contract.getJob(id);
        return {
          id,
          ...job
        };
      });

      const jobResults = await Promise.all(jobPromises);
      setJobs(jobResults);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchJobs();
    }
  }, [contract]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleJobCreated = () => {
    fetchJobs();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to TrustWork
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to start browsing and creating jobs
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                How it works
              </h2>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Connect your MetaMask wallet</li>
                <li>• Browse available jobs or create new ones</li>
                <li>• Funds are held in escrow until completion</li>
                <li>• Disputes are resolved by arbitrators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Board</h1>
            <p className="text-gray-600">Find freelance work or post new jobs</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Create Job</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="0">Created</option>
                <option value="1">Accepted</option>
                <option value="2">Delivered</option>
                <option value="3">Completed</option>
                <option value="4">Disputed</option>
                <option value="5">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a job!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onUpdate={fetchJobs}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateForm && (
        <CreateJobForm
          onJobCreated={handleJobCreated}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
} 