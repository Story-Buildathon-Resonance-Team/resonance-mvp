/**
 * Server-side configuration for Story Protocol
 * This file handles server-side initialization and should only be used in API routes
 */

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { privateKeyToAccount, Address } from 'viem/accounts'
import { http } from 'viem'
import { network, networkInfo } from './clientConfig'

let serverClient: StoryClient | null = null

/**
 * Initialize server-side Story Protocol configuration
 * This should only be called from API routes
 */
export function initializeServerConfig() {
  if (serverClient) {
    return { client: serverClient }
  }

  const privateKey = process.env.WALLET_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('WALLET_PRIVATE_KEY environment variable is required for server-side operations')
  }

  // Create account from private key
  const account = privateKeyToAccount(`0x${privateKey}` as Address)
  
  // Create Story client config
  const config: StoryConfig = {
    account,
    transport: http(networkInfo.rpcProviderUrl),
    chainId: network,
  }
  
  // Initialize Story client
  serverClient = StoryClient.newClient(config)
  
  console.log('Server-side Story Protocol client initialized')
  console.log('Network:', network)
  console.log('RPC URL:', networkInfo.rpcProviderUrl)
  console.log('Account:', account.address)
  
  return { client: serverClient }
}

/**
 * Get the initialized server client
 */
export function getServerClient(): StoryClient {
  if (!serverClient) {
    throw new Error('Server client not initialized. Call initializeServerConfig() first.')
  }
  return serverClient
}