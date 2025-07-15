'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWeb3 } from '../../../context/Web3Provider';
import { uploadToIPFS, validateFile } from '../../../utils/ipfs';
import { formatEther, shortenAddress, getJobStatus } from '../../../utils/web3';
import Header from '../../../components/Header';
import { Upload, File, X, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DeliverPage() {
  const { id } = useParams();
  const router = useRouter();
  const { contract, account } = useWeb3();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchJob();
  }, [contract, id]);

  const fetchJob = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const jobData = await contract.getJob(id);
      setJob({
        id: parseInt(id),
        ...jobData
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = [];
    
    for (const file of newFiles) {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (error) {
        toast.error(`${file.name}: ${error.message}`);
      }
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    try {
      setUploading(true);
      
      // Upload each file to IPFS
      const uploadPromises = files.map(async (file) => {
        const cid = await uploadToIPFS(file);
        return {
          name: file.name,
          cid,
          size: file.size,
          type: file.type
        };
      });

      const uploaded = await Promise.all(uploadPromises);
      setUploadedFiles(uploaded);
      
      toast.success('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const markAsDelivered = async () => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error('Please upload files first');
      return;
    }

    try {
      setUploading(true);
      
      // Create a JSON file with all file information
      const deliveryInfo = {
        files: uploadedFiles,
        deliveredAt: new Date().toISOString(),
        freelancer: account
      };

      const deliveryBlob = new Blob([JSON.stringify(deliveryInfo)], {
        type: 'application/json'
      });
      
      const deliveryFile = new File([deliveryBlob], 'delivery-info.json');
      const deliveryCid = await uploadToIPFS(deliveryFile);

      // Mark job as delivered
      const tx = await contract.markDelivered(id, deliveryCid);
      
      toast.promise(tx.wait(), {
        loading: 'Marking job as delivered...',
        success: 'Job marked as delivered successfully!',
        error: 'Failed to mark job as delivered'
      });

      await tx.wait();
      router.push('/my-jobs');
    } catch (error) {
      console.error('Error marking job as delivered:', error);
      toast.error(error.message || 'Failed to mark job as delivered');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to job board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFreelancer = job.freelancer === account;
  const canDeliver = isFreelancer && job.status === 1; // Accepted

  if (!canDeliver) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              Only the assigned freelancer can deliver work for this job.
            </p>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to job board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/my-jobs"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back to My Jobs</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deliver Work</h1>
          <p className="text-gray-600">Upload your completed work for job #{id}</p>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{job.title}</h2>
          <p className="text-gray-600 mb-4">{job.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Amount:</span>
              <span className="ml-2 text-gray-600">{formatEther(job.amount)} ETH</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2 text-gray-600">{getJobStatus(job.status)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Client:</span>
              <span className="ml-2 text-gray-600">{shortenAddress(job.client)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Deadline:</span>
              <span className="ml-2 text-gray-600">
                {new Date(job.deadline * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Deliverables</h3>
          
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          >
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Selected Files:</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <File size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={uploadFiles}
                disabled={uploading}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>{uploading ? 'Uploading...' : 'Upload to IPFS'}</span>
              </button>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>Files Uploaded Successfully</span>
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <File size={16} className="text-green-600" />
                    <span className="text-sm text-green-800">{file.name}</span>
                    <span className="text-xs text-green-600">({file.cid})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Deliver Button */}
        <div className="text-center">
          <button
            onClick={markAsDelivered}
            disabled={uploading || uploadedFiles.length === 0}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
          >
            <CheckCircle size={20} />
            <span>
              {uploading ? 'Processing...' : 'Mark as Delivered'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 