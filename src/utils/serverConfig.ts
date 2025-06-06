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
  try {
    if (serverClient) {
      console.log('Using existing server client')
      return { client: serverClient }
    }

    console.log('Checking environment variables...')
    const privateKey = process.env.WALLET_PRIVATE_KEY
    if (!privateKey) {
      throw new Error('WALLET_PRIVATE_KEY environment variable is required for server-side operations')
    }
    console.log('Private key found')

    // Create account from private key
    console.log('Creating account from private key...')
    const account = privateKeyToAccount(`0x${privateKey}` as Address)
    console.log('Account created:', account.address)
    
    // Create Story client config
    console.log('Creating Story client config...')
    const config: StoryConfig = {
      account,
      transport: http(networkInfo.rpcProviderUrl),
      chainId: network,
    }
    console.log('Config created for network:', network)
    
    // Initialize Story client
    console.log('Initializing Story client...')
    serverClient = StoryClient.newClient(config)
    console.log('Story client initialized successfully')
    
    console.log('Server-side Story Protocol client initialized')
    console.log('Network:', network)
    console.log('RPC URL:', networkInfo.rpcProviderUrl)
    console.log('Account:', account.address)
    
    return { client: serverClient }
  } catch (error) {
    console.error('Error initializing server config:', error)
    throw error
  }
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