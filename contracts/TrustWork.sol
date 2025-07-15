// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TrustWork is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    enum JobStatus { 
        Created, 
        Accepted, 
        Delivered, 
        Completed, 
        Disputed, 
        Cancelled 
    }

    struct Job {
        address client;
        address freelancer;
        uint256 amount;
        JobStatus status;
        string ipfsHash;
        string title;
        string description;
        uint256 createdAt;
        uint256 deadline;
        bool isDisputed;
    }

    struct Dispute {
        address initiator;
        string reason;
        uint256 createdAt;
        bool resolved;
        address arbitrator;
    }

    Counters.Counter private _jobIds;
    
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;
    
    uint256 public platformFee = 25; // 0.25% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    event JobCreated(uint256 indexed jobId, address indexed client, address indexed freelancer, uint256 amount, string title);
    event JobAccepted(uint256 indexed jobId, address indexed freelancer);
    event JobDelivered(uint256 indexed jobId, string ipfsHash);
    event JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event DisputeRaised(uint256 indexed jobId, address indexed initiator, string reason);
    event DisputeResolved(uint256 indexed jobId, bool payFreelancer, address arbitrator);
    event JobCancelled(uint256 indexed jobId, address indexed client);

    modifier onlyJobClient(uint256 jobId) {
        require(jobs[jobId].client == msg.sender, "Only job client can perform this action");
        _;
    }

    modifier onlyJobFreelancer(uint256 jobId) {
        require(jobs[jobId].freelancer == msg.sender, "Only job freelancer can perform this action");
        _;
    }

    modifier jobExists(uint256 jobId) {
        require(jobs[jobId].client != address(0), "Job does not exist");
        _;
    }

    modifier onlyArbitrator(uint256 jobId) {
        require(disputes[jobId].arbitrator == msg.sender || owner() == msg.sender, "Only arbitrator can resolve dispute");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createJob(
        address _freelancer,
        string memory _title,
        string memory _description,
        uint256 _deadline
    ) external payable returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(msg.value > 0, "Job amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        _jobIds.increment();
        uint256 jobId = _jobIds.current();

        jobs[jobId] = Job({
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            status: JobStatus.Created,
            ipfsHash: "",
            title: _title,
            description: _description,
            createdAt: block.timestamp,
            deadline: _deadline,
            isDisputed: false
        });

        clientJobs[msg.sender].push(jobId);
        freelancerJobs[_freelancer].push(jobId);

        emit JobCreated(jobId, msg.sender, _freelancer, msg.value, _title);
        return jobId;
    }

    function acceptJob(uint256 jobId) external jobExists(jobId) onlyJobFreelancer(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Created, "Job is not in Created status");
        require(block.timestamp <= job.deadline, "Job deadline has passed");

        job.status = JobStatus.Accepted;
        emit JobAccepted(jobId, msg.sender);
    }

    function markDelivered(uint256 jobId, string memory ipfsHash) external jobExists(jobId) onlyJobFreelancer(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Accepted, "Job must be accepted first");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        job.status = JobStatus.Delivered;
        job.ipfsHash = ipfsHash;
        emit JobDelivered(jobId, ipfsHash);
    }

    function confirmDelivery(uint256 jobId) external jobExists(jobId) onlyJobClient(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Delivered, "Job must be delivered first");
        require(!job.isDisputed, "Cannot confirm delivery while dispute is active");

        job.status = JobStatus.Completed;

        uint256 platformFeeAmount = (job.amount * platformFee) / BASIS_POINTS;
        uint256 freelancerAmount = job.amount - platformFeeAmount;

        (bool success, ) = job.freelancer.call{value: freelancerAmount}("");
        require(success, "Failed to transfer funds to freelancer");

        emit JobCompleted(jobId, job.freelancer, freelancerAmount);
    }

    function raiseDispute(uint256 jobId, string memory reason) external jobExists(jobId) {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client || msg.sender == job.freelancer, "Only client or freelancer can raise dispute");
        require(job.status == JobStatus.Accepted || job.status == JobStatus.Delivered, "Can only dispute accepted or delivered jobs");
        require(!job.isDisputed, "Dispute already exists");

        job.isDisputed = true;
        job.status = JobStatus.Disputed;

        disputes[jobId] = Dispute({
            initiator: msg.sender,
            reason: reason,
            createdAt: block.timestamp,
            resolved: false,
            arbitrator: address(0)
        });

        emit DisputeRaised(jobId, msg.sender, reason);
    }

    function assignArbitrator(uint256 jobId, address arbitrator) external onlyOwner jobExists(jobId) {
        require(disputes[jobId].initiator != address(0), "No dispute exists for this job");
        require(!disputes[jobId].resolved, "Dispute already resolved");
        require(arbitrator != address(0), "Invalid arbitrator address");

        disputes[jobId].arbitrator = arbitrator;
    }

    function resolveDispute(uint256 jobId, bool payFreelancer) external jobExists(jobId) onlyArbitrator(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        Dispute storage dispute = disputes[jobId];
        
        require(dispute.initiator != address(0), "No dispute exists");
        require(!dispute.resolved, "Dispute already resolved");
        require(job.isDisputed, "Job is not disputed");

        dispute.resolved = true;
        job.status = JobStatus.Completed;

        uint256 platformFeeAmount = (job.amount * platformFee) / BASIS_POINTS;
        uint256 remainingAmount = job.amount - platformFeeAmount;

        if (payFreelancer) {
            (bool success, ) = job.freelancer.call{value: remainingAmount}("");
            require(success, "Failed to transfer funds to freelancer");
        } else {
            (bool success, ) = job.client.call{value: remainingAmount}("");
            require(success, "Failed to transfer funds to client");
        }

        emit DisputeResolved(jobId, payFreelancer, msg.sender);
    }

    function cancelJob(uint256 jobId) external jobExists(jobId) onlyJobClient(jobId) nonReentrant {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Created, "Can only cancel created jobs");
        require(!job.isDisputed, "Cannot cancel job with active dispute");

        job.status = JobStatus.Cancelled;

        (bool success, ) = job.client.call{value: job.amount}("");
        require(success, "Failed to refund client");

        emit JobCancelled(jobId, job.client);
    }

    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }

    function getDispute(uint256 jobId) external view returns (Dispute memory) {
        return disputes[jobId];
    }

    function getClientJobs(address client) external view returns (uint256[] memory) {
        return clientJobs[client];
    }

    function getFreelancerJobs(address freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[freelancer];
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Platform fee cannot exceed 5%");
        platformFee = newFee;
    }

    function withdrawPlatformFees() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Failed to withdraw platform fees");
    }

    receive() external payable {}
} 