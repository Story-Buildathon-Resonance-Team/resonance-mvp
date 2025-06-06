"use client"

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { createPublicClient, createWalletClient, http, WalletClient } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import { network, networkInfo, PROTOCOL_EXPLORER } from './clientConfig'

// Global variables for client and account
let storyClient: StoryClient | null = null
export let account: Account | null = null

// Initialize Story Protocol client with private key
export function initializeStoryClient(privateKey: string) {
    // Create account from private key
    account = privateKeyToAccount(`0x${privateKey}` as Address)
    
    // Create Story client config
    const config: StoryConfig = {
        account,
        transport: http(networkInfo.rpcProviderUrl),
        chainId: network,
    }
    
    // Initialize Story client
    storyClient = StoryClient.newClient(config)
    
    return { client: storyClient, account }
}

// Get the initialized Story client
export function getStoryClient(): StoryClient {
    if (!storyClient) {
        throw new Error('Story client not initialized. Please connect wallet first.')
    }
    return storyClient
}

// Create public and wallet clients
export function createClients(account: Account) {
    const baseConfig = {
        chain: networkInfo.chain,
        transport: http(networkInfo.rpcProviderUrl),
    } as const
    
    const publicClient = createPublicClient(baseConfig)
    const walletClient = createWalletClient({
        ...baseConfig,
        account,
    }) as WalletClient
    
    return { publicClient, walletClient }
}

// Re-export for convenience
export { PROTOCOL_EXPLORER }