# Resonance MVP

Resonance is a collaborative storytelling platform that unlocks the untapped commercial potential of fictional universes. Most creative intellectual property remains underutilized after initial publication, leaving valuable characters and worlds unexplored while audiences demand expanded content. Our platform enables creators to monetize their universes through controlled collaboration, connecting writers with established IP foundations while ensuring transparent revenue sharing via Story Protocol for all contributors.

## Tech Stack

A Web3 storytelling platform built with:

- **Next.js** - Full-stack React framework
- **Story Protocol** - IP management and licensing
- **Tomo** - Social wallet connectivity
- **Pinata** - IPFS storage for content
- **Zustand** - State management

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Story-Buildathon-Resonance-Team/resonance-mvp.git
cd resonance-mvp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Server-side only
WALLET_PRIVATE_KEY=your_private_key_here
PINATA_JWT=your_pinata_jwt_here

# Client-side accessible
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_TOMO_CLIENT_ID=your_tomo_client_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_RPC_PROVIDER_URL=https://aeneid.storyrpc.io
NEXT_PUBLIC_PROTOCOL_EXPLORER=https://aeneid.explorer.story.foundation

# Optional - for enhanced UI experience
X_API_KEY=your_story_protocol_api_key
X_CHAIN=story-aeneid

# Optional - defaults provided if not set
STORY_NETWORK=aeneid
NFT_CONTRACT_ADDRESS=
SPG_NFT_CONTRACT_ADDRESS=
```

### 4. Get Your API Keys

#### Pinata (IPFS Storage)

1. Visit [Pinata](https://pinata.cloud) and create an account
2. Go to **API Keys** in your dashboard
3. Generate a new API key with admin permissions
4. Copy the **JWT** for `PINATA_JWT`
5. Copy the **API Key** for `NEXT_PUBLIC_PINATA_API_KEY`

#### Tomo (Wallet Connection)

1. Visit [Tomo](https://tomo.inc) and create a developer account
2. Create a new project in your dashboard
3. Copy your **Client ID** for `NEXT_PUBLIC_TOMO_CLIENT_ID`

#### Reown (formerly WalletConnect)

1. Visit [Reown](https://reown.com) (formerly WalletConnect)
2. Create an account and new project
3. Copy your **Project ID** for `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

#### Story Protocol API (Optional but Recommended)

1. Visit [Story Protocol API Documentation](https://docs.story.foundation/api-reference/protocol/introduction)
2. Follow the authentication guide to get your API key
3. Use the key for `X_API_KEY`
4. This enables enhanced UI features like parent/child story counts and license terms

#### Wallet Private Key

- If connecting with an existing wallet: Export your private key from MetaMask or your preferred wallet
- If using Tomo social login: You can skip this initially and get the generated wallet address from the browser console after connecting

### 5. Get Testnet Tokens

1. **Connect to the app first** to get your wallet address
2. **Get testnet tokens**: Visit the [Story Protocol Faucet](https://docs.story.foundation/network/network-info/aeneid#faucet)
3. **Request tokens**: Enter your wallet address and request tokens
4. **Confirmation**: You'll receive 10 IP tokens (more than enough for testing)

> **Note**: If using Tomo social login, your wallet address will appear in the browser developer console after connecting. Use this address for the faucet.

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to start using Resonance.

### 7. First Steps

1. **Connect your wallet**: Click "Login" and choose your preferred method:
   - **Email/Social**: Connect with Gmail, X (Twitter), Telegram, or email
   - **Wallet**: Connect your existing crypto wallet
2. **Get testnet tokens**: Use the faucet with your wallet address
3. **Explore sample stories**: Browse existing stories for inspiration
4. **Create your first story**: Click "Publish Story" to start writing

## Sample Stories

Need inspiration? Check out the sample stories in `src/data/stories/` - these are example stories you can use as templates or inspiration for your own creations.

## Project Structure

```
src/
├── app/                    # Next.js app directory
|   |–– api/               # API endpoints
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # User dashboard
│   ├── stories/           # Story browsing and reading
│   ├── publish-form/      # Story creation form
|   |–– remix-form/        # Story remix form
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── data/                 # Static data and configuration
│   ├── stories/          # Sample story files
│   └── user.ts          # User data structure
├── hooks/                # Custom React hooks
├── lib/                  # Core libraries
│   └── licenses.ts       # Story Protocol license definitions
├── services/             # API services
│   ├── licenseService.ts # License management
│   └── registerStory.ts  # Story registration
├── stores/               # Zustand state management
└── utils/                # Helper functions and configurations
    ├── config.ts         # Story Protocol configuration
    ├── server.ts         # Server utilities
    |–– client.ts         # Client utilities
    |__ storyProtocolService.ts # Story Protocol Configuration
```

## Key Features

- **Social Wallet Integration**: Connect with Tomo using email, social accounts, or existing wallets.
  Check the integration in the following files:
  - Web3Providers.tsx
  - useConnect.tsx (hooks folder)
  - Navigation.tsx
  - Sidebar.tsx
- **Story Protocol Integration**: Protect your IP and enable controlled collaboration
- **IPFS Storage**: Decentralized content storage via Pinata
- **Flexible Licensing**: Choose how others can build on your work
- **Story Discovery**: Find and remix existing stories

## Network Information

- **Network**: Story Protocol Aeneid Testnet
- **RPC URL**: https://aeneid.storyrpc.io
- **Block Explorer**: https://aeneid.storyscan.io
- **Protocol Explorer**: https://aeneid.explorer.story.foundation
- **Faucet**: Available through Story Protocol documentation

## Troubleshooting

### Common Issues

**"Not connected" message persists**

- Verify all required environment variables are set
- Check browser console for connection errors
- Ensure you're on the correct network (Aeneid testnet)

**IPFS upload failures**

- Verify your Pinata API key and JWT are correct
- Check your Pinata account limits and billing
- Ensure both `PINATA_JWT` and `NEXT_PUBLIC_PINATA_API_KEY` are set

**Transaction failures**

- Get testnet tokens from the Story Protocol faucet
- Verify your wallet has sufficient IP tokens
- Check the network connection and RPC endpoint

**Story Protocol API issues**

- Basic functionality works without the API key
- Enhanced features (story counts, license details) require a valid `X_API_KEY`
- Check your API rate limits if requests are failing

### User Data Issues

If you experience issues with user data persistence:

1. Check the browser console for Zustand store errors
2. Clear browser storage and reconnect your wallet
3. As a last resort, manually add a user object in `src/data/user.ts`

## Development Notes

- **State Management**: Uses Zustand for persistent state across page reloads
- **Wallet Connection**: Tomo handles all wallet connectivity (social login + traditional wallets)
- **Content Storage**: All story content and images stored on IPFS via Pinata
- **IP Protection**: Story Protocol manages licensing and derivative work relationships

## Support

For technical issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly configured
3. Ensure your wallet has testnet tokens
4. Review the [Story Protocol documentation](https://docs.story.foundation/)
5. Check [Tomo documentation](https://docs.tomo.inc/) for wallet connection issues

## Contributors

- **[Craig Mutegi](https://github.com/cmm25)**
- **[Nat Gómez](https://github.com/inatgomez)**
- **[Xavier](https://github.com/xmd404v2)**

---

_Built for the Story Protocol Buildathon_
