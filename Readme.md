# TrustWork - Decentralized Freelance Platform

A blockchain-based freelance platform with escrow functionality, built with Next.js, Solidity, and IPFS.

## 🚀 Features

- **Smart Contract Escrow**: Secure fund management with automatic release
- **IPFS File Storage**: Decentralized storage for deliverables
- **Dispute Resolution**: Built-in arbitration system
- **MetaMask Integration**: Seamless wallet connection
- **Real-time Updates**: Live job status tracking
- **Role-based Access**: Client and freelancer specific actions

## 🏗️ Architecture

### Frontend (React/Next.js)
- Job creation and management
- File upload to IPFS
- Wallet connection (MetaMask)
- Real-time job status updates

### Smart Contract (Solidity)
- Escrow functionality
- Job lifecycle management
- Dispute resolution
- Access control

### Storage (IPFS)
- Decentralized file storage
- Content-addressed files
- Permanent and immutable

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MetaMask browser extension
- Git

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd TrustWork
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token_here
```

Get your Web3.Storage token from [https://web3.storage](https://web3.storage)

### 3. Deploy Smart Contract

```bash
# Install Hardhat globally (if not already installed)
npm install -g hardhat

# Compile contracts
npm run compile

# Start local blockchain
npx hardhat node

# In a new terminal, deploy the contract
npm run deploy
```

The contract address will be saved to `src/contract-info.json`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Usage Guide

### For Clients

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Create Job**: Click "Create Job" and fill in details
3. **Fund Escrow**: Send ETH to fund the job
4. **Review Work**: When freelancer delivers, review and confirm
5. **Release Payment**: Confirm delivery to release funds

### For Freelancers

1. **Browse Jobs**: View available jobs on the job board
2. **Accept Job**: Accept jobs assigned to you
3. **Complete Work**: Finish the job requirements
4. **Upload Deliverables**: Upload files to IPFS
5. **Mark Delivered**: Submit work for client review

### Dispute Resolution

- Either party can raise a dispute during accepted/delivered status
- Arbitrators can resolve disputes and distribute funds
- Platform fee is automatically deducted (0.25%)

## 🔧 Smart Contract Functions

### Core Functions
- `createJob()` - Create new job with escrow
- `acceptJob()` - Freelancer accepts job
- `markDelivered()` - Submit deliverables
- `confirmDelivery()` - Client approves work
- `raiseDispute()` - Initiate dispute resolution
- `resolveDispute()` - Arbitrator resolves dispute
- `cancelJob()` - Cancel job (client only)

### Access Control
- **Client-only**: `createJob`, `confirmDelivery`, `cancelJob`
- **Freelancer-only**: `markDelivered`
- **Arbitrator-only**: `resolveDispute`

## 🗂️ Project Structure

```
TrustWork/
├── contracts/
│   └── TrustWork.sol          # Main smart contract
├── scripts/
│   └── deploy.js              # Deployment script
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── deliver/[id]/      # Delivery page
│   │   ├── my-jobs/          # User jobs page
│   │   └── page.jsx          # Job board
│   ├── components/            # React components
│   │   ├── CreateJobForm.jsx
│   │   ├── Header.jsx
│   │   └── JobCard.jsx
│   ├── context/              # React context
│   │   └── Web3Provider.jsx
│   └── utils/                # Utility functions
│       ├── ipfs.js           # IPFS utilities
│       └── web3.js           # Web3 utilities
├── hardhat.config.js         # Hardhat configuration
└── package.json
```

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Role-based function access
- **Input Validation**: Comprehensive parameter validation
- **Secure Escrow**: Funds locked until completion
- **Dispute Resolution**: Fair arbitration system

## 🌐 Supported Networks

- Ethereum Mainnet
- Polygon
- Base
- Local Hardhat Network (for development)

## 🧪 Testing

```bash
# Run smart contract tests
npm run test

# Run frontend tests
npm run test:frontend
```

## 📦 Deployment

### Smart Contract
```bash
# Deploy to specific network
npx hardhat run scripts/deploy.js --network <network-name>
```

### Frontend
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community Discord

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- Basic job creation and management
- IPFS file upload
- Dispute resolution system
- MetaMask integration

---

**Built with ❤️ using Next.js, Solidity, and IPFS**
