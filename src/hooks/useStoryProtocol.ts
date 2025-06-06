"use client"

import { useState, useCallback } from 'react'
import { initializeStoryClient, account as globalAccount } from '@/utils/browserConfig'
import { Account } from 'viem/accounts'

interface UseStoryProtocolReturn {
    account: Account | null
    isConnected: boolean
    connect: (privateKey: string) => void
    disconnect: () => void
    error: string | null
}

export function useStoryProtocol(): UseStoryProtocolReturn {
    const [account, setAccount] = useState<Account | null>(globalAccount)
    const [error, setError] = useState<string | null>(null)

    const connect = useCallback((privateKey: string) => {
        try {
            setError(null)
            // Remove 0x prefix if present
            const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
            
            // Validate private key format
            if (!/^[0-9a-fA-F]{64}$/.test(cleanPrivateKey)) {
                throw new Error('Invalid private key format. Must be 64 hex characters.')
            }
            
            const { account: newAccount } = initializeStoryClient(cleanPrivateKey)
            setAccount(newAccount)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect wallet')
            console.error('Error connecting wallet:', err)
        }
    }, [])

    const disconnect = useCallback(() => {
        setAccount(null)
        // Note: We don't reset the global client here as it might be used by other components
        // In a production app, you might want to handle this differently
    }, [])

    return {
        account,
        isConnected: !!account,
        connect,
        disconnect,
        error
    }
}