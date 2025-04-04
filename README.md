# Koii Blockchain Transaction Analysis Node

## 🌐 Project Overview

The Koii Blockchain Transaction Analysis Node is an open-source project designed to monitor and analyze blockchain transactions on the Koii network. This backend service provides a robust, transparent API for tracking wallet activities, identifying exchange interactions, and detecting significant token movements.

### Key Features
- 🔍 Real-time blockchain transaction monitoring
- 📊 Exchange deposit address tracking
- 🚨 Large transfer detection
- 🔐 Verifiable transaction flagging
- 🌈 Comprehensive RESTful API endpoints

### Use Cases
- Track wallet interactions with exchanges
- Identify potential token dumping behavior
- Monitor significant blockchain movements
- Provide transparent transaction analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- Access to Koii network RPC endpoint

### Installation
1. Clone the repository
```bash
git clone https://github.com/YOUR-ORG/koii-analysis-node.git
cd koii-analysis-node
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file with the following:
```bash
KOII_RPC_ENDPOINT=https://mainnet.koii.network
TRANSACTION_THRESHOLD=10000  # Example large transfer threshold
```

4. Start the development server
```bash
npm start
```

## 📡 API Documentation

### Available Endpoints

#### 1. Flagged Transactions
- **GET** `/api/flagged-transactions`
  - Retrieves list of transactions flagged for potential dumping
- **Parameters:**
  - `limit` (optional): Maximum number of transactions to return
  - `offset` (optional): Pagination offset

**Example Response:**
```json
{
  "transactions": [
    {
      "txId": "abc123...",
      "wallet": "0x1234...",
      "amount": 50000,
      "timestamp": "2023-05-15T10:30:00Z"
    }
  ]
}
```

#### 2. Wallet Activity
- **GET** `/api/wallet/{address}`
  - Retrieve historical activity for a specific wallet
- **Parameters:**
  - `address`: Wallet address to query

**Example Response:**
```json
{
  "address": "0x1234...",
  "totalTransactions": 42,
  "exchangeInteractions": 5,
  "largeTransfers": 3
}
```

#### 3. Real-time Alerts
- **GET** `/api/alerts`
  - Stream real-time alerts for major transfers

## 🔐 Authentication

The API uses API key-based authentication:
- Include `X-API-Key` header in requests
- API keys can be generated through the developer portal

**Sample Authentication Header:**
```http
X-API-Key: your_secret_api_key_here
```

## 📂 Project Structure
```
koii-analysis-node/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handling logic
│   ├── models/          # Data models
│   ├── services/        # Blockchain interaction logic
│   └── utils/           # Utility functions
├── tests/               # Unit and integration tests
└── config/              # Configuration files
```

## 🛠 Technologies Used
- Node.js
- Express.js
- TypeScript
- Koii JSON-RPC
- Winston (Logging)
- Jest (Testing)

## 🚢 Deployment

### Docker
```bash
docker build -t koii-analysis-node .
docker run -p 3000:3000 koii-analysis-node
```

### Cloud Deployment
- Supports deployment on AWS, GCP, and Azure
- Use environment-specific configurations
- Recommended: Kubernetes for scalability

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and submit a pull request

## 📄 License
This project is licensed under the MIT License. See `LICENSE` file for details.

---
**Join the Koii Network Community!** 🌟
Contribute, discuss, and help improve blockchain transparency.