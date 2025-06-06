// Client-safe configuration that doesn't require server-side environment variables
import { aeneid, mainnet } from '@story-protocol/core-sdk'
import { Chain } from 'viem'
import { Address } from 'viem/accounts'

// Network configuration types
type NetworkType = 'aeneid' | 'mainnet'

interface NetworkConfig {
    rpcProviderUrl: string
    blockExplorer: string
    protocolExplorer: string
    defaultNFTContractAddress: Address | null
    defaultSPGNFTContractAddress: Address | null
    chain: Chain
}

// Network configurations
const networkConfigs: Record<NetworkType, NetworkConfig> = {
    aeneid: {
        rpcProviderUrl: 'https://aeneid.storyrpc.io',
        blockExplorer: 'https://aeneid.storyscan.io',
        protocolExplorer: 'https://aeneid.explorer.story.foundation',
        defaultNFTContractAddress: '0x937bef10ba6fb941ed84b8d249abc76031429a9a' as Address,
        defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as Address,
        chain: aeneid,
    },
    mainnet: {
        rpcProviderUrl: 'https://mainnet.storyrpc.io',
        blockExplorer: 'https://storyscan.io',
        protocolExplorer: 'https://explorer.story.foundation',
        defaultNFTContractAddress: null,
        defaultSPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE' as Address,
        chain: mainnet,
    },
} as const

// Helper functions
const getNetwork = (): NetworkType => {
    const network = (process.env.NEXT_PUBLIC_STORY_NETWORK || 'aeneid') as NetworkType
    if (!(network in networkConfigs)) {
        console.warn(`Invalid network: ${network}. Using aeneid.`)
        return 'aeneid'
    }
    return network
}

// Initialize client configuration
export const network = getNetwork()

export const networkInfo = {
    ...networkConfigs[network],
    rpcProviderUrl: process.env.NEXT_PUBLIC_RPC_PROVIDER_URL || networkConfigs[network].rpcProviderUrl,
}

// Export additional useful constants
export const PROTOCOL_EXPLORER = networkInfo.protocolExplorer