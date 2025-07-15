'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Provider';
import Header from '../../components/Header';
import JobCard from '../../components/JobCard';
import { User, Briefcase, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyJobs() {
  const { contract, account, isConnected } = useWeb3();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'client', 'freelancer'

  const fetchMyJobs = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      const allJobs = [];
      
      // Get all job IDs by checking recent events
      // For demo purposes, we'll check jobs 1-50
      for (let i = 1; i <= 50; i++) {
        try {
          const job = await contract.getJob(i);
          if (job.client !== '0x0000000000000000000000000000000000000000') {
            // Check if current user is involved in this job
            if (job.client === account || job.freelancer === account) {
              allJobs.push({
                id: i,
                ...job
              });
            }
          }
        } catch (error) {
          // Job doesn't exist, continue
          break;
        }
      }

      setJobs(allJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchMyJobs();
    }
  }, [contract, account]);

  const filteredJobs = jobs.filter(job => {
    if (roleFilter === 'client') {
      return job.client === account;
    } else if (roleFilter === 'freelancer') {
      return job.freelancer === account;
    }
    return true; // 'all' filter
  });

  const clientJobs = jobs.filter(job => job.client === account);
  const freelancerJobs = jobs.filter(job => job.freelancer === account);

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              My Jobs
            </h1>
            <p className="text-lg text-gray-600">
              Connect your wallet to view your jobs
            </p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
          <p className="text-gray-600">Manage your jobs as a client or freelancer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">As Client</p>
                <p className="text-2xl font-bold text-gray-900">{clientJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">As Freelancer</p>
                <p className="text-2xl font-bold text-gray-900">{freelancerJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter size={16} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="client">As Client</option>
              <option value="freelancer">As Freelancer</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Briefcase size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {roleFilter === 'all' 
                ? "You haven't participated in any jobs yet. Start by browsing the job board!"
                : `You haven't participated in any jobs as ${roleFilter === 'client' ? 'a client' : 'a freelancer'} yet.`
              }
            </p>
            {roleFilter === 'all' && (
              <a 
                href="/" 
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Job Board
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onUpdate={fetchMyJobs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 