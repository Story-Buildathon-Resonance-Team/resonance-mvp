# Resonance MVP

A Web3 application built with Next.js, integrating Story Protocol for IP management and Tomo wallet connectivity.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A crypto wallet for testing (MetaMask, etc.) if not using Tomo social login
- Pinata account for IPFS storage
- Tomo client credentials

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Story-Buildathon-Resonance-Team/resonance-mvp.git
cd resonance-mvp
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Story Protocol Configuration
NEXT_PUBLIC_RPC_PROVIDER_URL=https://aeneid.storyrpc.io
STORY_NETWORK=aeneid

# Wallet Configuration
WALLET_PRIVATE_KEY=your_wallet_private_key_here

# Tomo Wallet Integration
NEXT_PUBLIC_TOMO_CLIENT_ID=your_tomo_client_id_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here

# IPFS Storage (Pinata)
PINATA_JWT=your_pinata_jwt_token_here

# Smart Contract Addresses (Optional - will use defaults if not provided)
SPG_NFT_CONTRACT_ADDRESS=your_spg_nft_contract_address_here
```

#### How to Get Each Variable:

- **WALLET_PRIVATE_KEY**: Export your wallet's private key from MetaMask or your preferred wallet
- **NEXT_PUBLIC_TOMO_CLIENT_ID**: Register at [Tomo](https://tomo.inc) to get your client ID
- **NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID**: Create a project at [WalletConnect](https://walletconnect.com)
- **PINATA_JWT**: Sign up at [Pinata](https://pinata.cloud) and generate a JWT token
- **SPG_NFT_CONTRACT_ADDRESS**: Optional - the app will use default contract addresses if not provided

### 4. Update User Data

After connecting your wallet through Tomo:

1. Run the application (see step 5)
2. Connect your wallet using the "Login with Tomo" button
3. Copy your wallet address from the connection display
4. Open `src/data/user.ts`
5. Find the empty user object (last entry in the `users` array)
6. Paste your wallet address in the `walletAddress` field
7. Add your username in the `userName` field

Example:

```typescript
{
  userName: "YourUsername", // Add your preferred username
  walletAddress: "0x1234...5678", // Paste your connected wallet address here
  stories: [
    // Your stories will be populated here
  ],
}
```

### 5. Run the Development Server

```bash
npm run dev
```

Or with Yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Test the Connection

1. Click the "Login with Tomo" button
2. Connect your social account through the Tomo interface
3. Verify that your wallet address appears on the page
4. Check the browser console for connection logs

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main login/connection page
│   ├── layout.tsx      # Root layout with Web3 providers
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
│   └── ui/            # shadcn/ui components
├── data/              # Static data and configuration
│   ├── user.ts        # User data structure
│   └── ipIds.ts       # Featured IP IDs
├── lib/               # Utility libraries
└── utils/             # Helper functions and configurations
    ├── config.ts      # Story Protocol configuration
    └── functions/     # Utility functions
```

## Key Features

- **Web3 Wallet Integration**: Connect wallets using Tomo EVM Kit
- **Story Protocol Integration**: Create and manage IP assets
- **IPFS Storage**: Upload and store content using Pinata
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Troubleshooting

### Common Issues

1. **"Not connected" message persists**

   - Check that all environment variables are correctly set
   - Ensure your wallet is connected to the correct network (Aeneid testnet)

2. **IPFS upload failures**

   - Verify your PINATA_JWT token is valid
   - Check your Pinata account limits

3. **Transaction failures**
   - Ensure your wallet has enough testnet tokens
   - Verify the WALLET_PRIVATE_KEY is correct

### Network Information

- **Network**: Story Protocol Aeneid Testnet
- **RPC URL**: https://aeneid.storyrpc.io
- **Block Explorer**: https://aeneid.storyscan.io
- **Protocol Explorer**: https://aeneid.explorer.story.foundation

## Next Steps

1. Connect your wallet and verify the connection
2. Update your user data in `src/data/user.ts`
3. Start building your stories and IP assets
4. Explore the Story Protocol integration features

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure you're connected to the correct network
4. Check that your wallet has sufficient testnet tokens

For additional help, refer to the [Story Protocol documentation](https://docs.story.foundation/) or [Tomo documentation](https://docs.tomo.inc/).
