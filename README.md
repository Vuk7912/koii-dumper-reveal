# Koii Blockchain Transaction Analysis Node

## Project Overview

This open-source backend service provides a sophisticated blockchain transaction monitoring and analysis system for the Koii network. The API enables real-time tracking and detailed exploration of KOII token transactions, with a focus on detecting significant wallet movements and exchange interactions.

### Key Features
- 🔍 Real-time blockchain transaction monitoring
- 🚨 Automatic detection of large token transfers
- 📊 Comprehensive wallet activity tracking
- 🔒 Verifiable transaction flagging
- 🌐 Transparent, open-source API endpoints

### Use Cases
- Monitor exchange deposit activities
- Track potential token dumping behavior
- Analyze large wallet balance changes
- Provide transparent blockchain insights

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm (v6+)
- Access to Koii mainnet RPC endpoint

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
```env
KOII_RPC_ENDPOINT=https://mainnet.koii.network
TRANSACTION_THRESHOLD=10000  # KOII tokens
EXCHANGE_ADDRESSES=["address1", "address2"]
```

4. Start the development server
```bash
npm run dev
```

## API Documentation

### Available Endpoints

#### 1. Flagged Transactions
- **Path:** `/api/flagged-transactions`
- **Method:** GET
- **Description:** Retrieve list of transactions flagged for potential dumping
- **Response Example:**
```json
{
  "transactions": [
    {
      "txId": "abc123",
      "from": "wallet_address",
      "to": "exchange_address",
      "amount": 50000,
      "timestamp": "2023-06-15T10:30:00Z"
    }
  ]
}
```

#### 2. Wallet Activity
- **Path:** `/api/wallet/{address}`
- **Method:** GET
- **Description:** Get historical activity for a specific wallet
- **Response Example:**
```json
{
  "address": "wallet_address",
  "totalTransactions": 42,
  "exchangeInteractions": 3,
  "largeTransfers": [
    {
      "amount": 25000,
      "timestamp": "2023-06-10T15:45:00Z"
    }
  ]
}
```

#### 3. Real-time Alerts
- **Path:** `/api/alerts`
- **Method:** WebSocket
- **Description:** Stream real-time alerts for significant transactions

## Authentication

The API uses API key-based authentication:
- Include `X-API-KEY` header in requests
- API keys can be generated in user dashboard
- Rate limits apply based on key tier

Example request:
```http
GET /api/flagged-transactions
X-API-KEY: your_api_key_here
```

## Project Structure
```
koii-analysis-node/
├── src/
│   ├── routes/         # API route definitions
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── config/             # Configuration files
├── tests/              # Unit and integration tests
└── docker/             # Containerization support
```

## Technologies Used
- Runtime: Node.js
- Web Framework: Express.js
- Blockchain Interaction: Koii JSON-RPC
- Authentication: JWT
- Testing: Jest
- Containerization: Docker

## Deployment

### Docker Deployment
```bash
docker build -t koii-analysis-node .
docker run -p 3000:3000 koii-analysis-node
```

### Cloud Platforms
Supports deployment on:
- AWS ECS/Fargate
- Google Cloud Run
- Heroku

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

**Built with ❤️ for the Koii Network Community**