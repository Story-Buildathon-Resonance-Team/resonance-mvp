"use client"

import { getStoryClient } from './browserConfig'
import { uploadFileToIPFS, uploadJSONToIPFS } from './functions/uploadIPFS'
import {
    SPGNFTContractAddress,
    NonCommercialSocialRemixingTerms,
    NonCommercialSocialRemixingTermsId,
    CommercialUseOnlyTerms,
    CommercialUseOnlyTermsId,
    CommercialRemixTerms,
    CommercialRemixTermsId,
    PILTemplateAddress
} from './utils'
import { Address, keccak256, toHex, zeroAddress } from 'viem'

export interface IPMetadata {
    title: string
    description: string
    ipType: string
    creator: string
    contentHash?: string
    contentUrl?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export interface RegisterIPResult {
    success: boolean
    ipId?: Address
    tokenId?: bigint
    licenseTermsId?: bigint
    txHash?: string
    error?: string
}

export interface LicenseOptions {
    type: 'non-commercial' | 'commercial-use' | 'commercial-remix'
    commercialRevShare?: number
    defaultMintingFee?: number
}

export interface DerivativeMetadata {
    title: string
    description: string
    creator: string
    parentIpId: Address
    ipType?: string
}

export interface MintDerivativeResult {
    success: boolean
    childIpId?: Address
    tokenId?: bigint
    txHash?: string
    error?: string
}

/**
 * Get license terms based on license type (only valid license types)
 */
function getLicenseTerms(licenseType: string) {
    switch (licenseType) {
        case 'non-commercial':
            return NonCommercialSocialRemixingTerms
        case 'commercial-use':
            return CommercialUseOnlyTerms
        case 'commercial-remix':
            return CommercialRemixTerms
        default:
            return NonCommercialSocialRemixingTerms
    }
}
function getLicenseTermsId(licenseType: string): string {
    switch (licenseType) {
        case 'non-commercial':
            return NonCommercialSocialRemixingTermsId
        case 'commercial-use':
            return CommercialUseOnlyTermsId
        case 'commercial-remix':
            return CommercialRemixTermsId
        default:
            return NonCommercialSocialRemixingTermsId
    }
}
export async function uploadAndRegisterIP(
    file: File,
    metadata: IPMetadata,
    recipientAddress: Address,
    pinataApiKey?: string,
    licenseOptions?: LicenseOptions
): Promise<RegisterIPResult> {
    try {
        const client = getStoryClient()
        
        // Upload file and metadata (your existing code)
        const fileHash = await uploadFileToIPFS(file, pinataApiKey)
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${fileHash}`
        
        const fullMetadata = {
            ...metadata,
            contentHash: fileHash,
            contentUrl: fileUrl,
            timestamp: new Date().toISOString(),
            fileType: file.type,
            fileName: file.name
        }
        
        const metadataHash = await uploadJSONToIPFS({...fullMetadata}, pinataApiKey)
        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataHash}`
        const metadataHashBytes32 = keccak256(toHex(metadataHash))
        
        // Use the modern combined function that handles everything in one transaction
        const licenseType = licenseOptions?.type || 'non-commercial'
        const licenseTerms = getLicenseTerms(licenseType)
        
        console.log('Minting and registering IP with PIL terms...')
        console.log('SPG NFT Contract:', SPGNFTContractAddress)
        console.log('Recipient:', recipientAddress)
        console.log('License Type:', licenseType)
        console.log('Metadata Hash (original):', metadataHash)
        console.log('Metadata Hash (bytes32):', metadataHashBytes32)
        
        // Validate SPG NFT Contract Address
        if (!SPGNFTContractAddress || SPGNFTContractAddress === zeroAddress) {
            throw new Error('SPG NFT Contract Address is not configured')
        }
        
        // Use the modern approach that handles everything in one transaction
        const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
            spgNftContract: SPGNFTContractAddress,
            licenseTermsData: [{ terms: licenseTerms }],
            ipMetadata: {
                ipMetadataURI: metadataUrl,
                ipMetadataHash: metadataHashBytes32,
                nftMetadataURI: metadataUrl,
                nftMetadataHash: metadataHashBytes32
            },
            recipient: recipientAddress,
            txOptions: { waitForTransaction: true }
        })
        
        console.log('IP minted and registered with PIL terms:', response)
        
        return {
            success: true,
            ipId: response.ipId as Address,
            tokenId: response.tokenId,
            licenseTermsId: response.licenseTermsIds?.[0],
            txHash: response.txHash
        }
    } catch (error) {
        console.error('Error registering IP:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}
export async function mintDerivativeNFT(
    parentIpId: Address,
    metadata: DerivativeMetadata,
    recipientAddress: Address,
    pinataApiKey?: string,
    parentLicenseTermsId?: string | bigint
): Promise<MintDerivativeResult> {
    try {
        const client = getStoryClient()

        // Step 1: Upload metadata to IPFS
        console.log('Uploading derivative metadata to IPFS...')
        const fullMetadata = {
            ...metadata,
            timestamp: new Date().toISOString(),
            type: 'derivative',
            parentIpId
        }
        const metadataHash = await uploadJSONToIPFS(fullMetadata, pinataApiKey)
        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataHash}`

        // Convert IPFS hash to bytes32 format
        const metadataHashBytes32 = keccak256(toHex(metadataHash))

        // Step 2: Determine license terms to use
        const licenseTermsId = parentLicenseTermsId || NonCommercialSocialRemixingTermsId
        const licenseTermsIdBigInt = typeof licenseTermsId === 'string' ? BigInt(licenseTermsId) : licenseTermsId

        console.log('Minting derivative NFT...')
        console.log('Parent IP ID:', parentIpId)
        console.log('Recipient:', recipientAddress)
        console.log('License Terms ID:', licenseTermsId)

        // Validate SPG NFT Contract Address
        if (!SPGNFTContractAddress || SPGNFTContractAddress === zeroAddress) {
            throw new Error('SPG NFT Contract Address is not configured')
        }

        try {
            console.log('Ensuring parent IP has required license terms attached...')
            try {
                await client.license.attachLicenseTerms({
                    ipId: parentIpId,
                    licenseTermsId: licenseTermsId,
                    licenseTemplate: PILTemplateAddress,
                    txOptions: {
                        waitForTransaction: true
                    }
                })
                console.log('License terms attached to parent IP successfully')
            } catch (attachError) {
                console.log('License terms may already be attached to parent IP:', attachError)
            }
            const mintResult = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
                spgNftContract: SPGNFTContractAddress,
                recipient: recipientAddress,
                derivData: {
                    parentIpIds: [parentIpId],
                    licenseTermsIds: [licenseTermsIdBigInt],
                    licenseTemplate: PILTemplateAddress
                },
                ipMetadata: {
                    ipMetadataURI: metadataUrl,
                    ipMetadataHash: metadataHashBytes32,
                    nftMetadataURI: metadataUrl,
                    nftMetadataHash: metadataHashBytes32
                },
                txOptions: {
                    waitForTransaction: true
                }
            })

            console.log('Derivative minted and registered:', mintResult)

            return {
                success: true,
                childIpId: mintResult.ipId as Address,
                tokenId: mintResult.tokenId,
                txHash: mintResult.txHash
            }
        } catch (mintError: unknown) {
            console.error('Derivative minting failed:', mintError)
            if (licenseTermsId !== NonCommercialSocialRemixingTermsId) {
                console.log('Retrying with non-commercial license terms...')
                try {
                    const retryResult = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
                        spgNftContract: SPGNFTContractAddress,
                        recipient: recipientAddress,
                        derivData: {
                            parentIpIds: [parentIpId],
                            licenseTermsIds: [BigInt(NonCommercialSocialRemixingTermsId)],
                            licenseTemplate: PILTemplateAddress
                        },
                        ipMetadata: {
                            ipMetadataURI: metadataUrl,
                            ipMetadataHash: metadataHashBytes32,
                            nftMetadataURI: metadataUrl,
                            nftMetadataHash: metadataHashBytes32
                        },
                        txOptions: {
                            waitForTransaction: true
                        }
                    })

                    console.log('Derivative minted with non-commercial terms:', retryResult)
                    return {
                        success: true,
                        childIpId: retryResult.ipId as Address,
                        tokenId: retryResult.tokenId,
                        txHash: retryResult.txHash
                    }
                } catch (retryError) {
                    console.error('Retry also failed:', retryError)
                }
            }
            
            // Provide helpful error messages
            if (mintError instanceof Error) {
                if (mintError.message?.includes('License terms id') || mintError.message?.includes('license')) {
                    throw new Error(
                        `The parent IP does not have the required license terms attached or does not allow derivatives. ` +
                        `Please ensure the parent IP (${parentIpId}) has license terms that allow derivatives. ` +
                        `You may need to use a different parent IP or register your own IP first.`
                    )
                }
                if (mintError.message?.includes('not found') || mintError.message?.includes('does not exist')) {
                    throw new Error(
                        `The parent IP (${parentIpId}) was not found. Please verify the IP ID is correct and the IP exists on the blockchain.`
                    )
                }
            }
            throw mintError
        }

    } catch (error) {
        console.error('Error minting derivative:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

export async function getIPMetadata(ipId: Address): Promise<IPMetadata | null> {
    try {

        console.log('Fetching metadata for IP:', ipId)
        return null
    } catch (error) {
        console.error('Error fetching IP metadata:', error)
        return null
    }
}
export async function registerExistingNFTAsIP(
    nftContract: Address, 
    tokenId: bigint, 
    metadata: IPMetadata,
    licenseOptions?: LicenseOptions
): Promise<RegisterIPResult> {
    try {
        const client = getStoryClient()

        // Upload metadata to IPFS
        console.log('Uploading metadata to IPFS...')
        const metadataHash = await uploadJSONToIPFS({ ...metadata })
        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataHash}`
        const metadataHashBytes32 = keccak256(toHex(metadataHash))

        // Determine license terms
        const licenseType = licenseOptions?.type || 'non-commercial'
        const licenseTerms = getLicenseTerms(licenseType)

        console.log('Registering NFT as IP Asset with PIL terms...')
        console.log('NFT Contract:', nftContract)
        console.log('Token ID:', tokenId)
        console.log('License Type:', licenseType)

        try {
            // Use the modern approach to register with PIL terms
            const result = await client.ipAsset.registerIpAndAttachPilTerms({
                nftContract,
                tokenId: tokenId.toString(),
                licenseTermsData: [{ terms: licenseTerms }],
                ipMetadata: {
                    ipMetadataURI: metadataUrl,
                    ipMetadataHash: metadataHashBytes32,
                    nftMetadataURI: metadataUrl,
                    nftMetadataHash: metadataHashBytes32
                },
                txOptions: {
                    waitForTransaction: true
                }
            })

            console.log('NFT registered as IP with PIL terms:', result)

            return {
                success: true,
                ipId: result.ipId as Address,
                tokenId,
                licenseTermsId: result.licenseTermsIds?.[0],
                txHash: result.txHash
            }
        } catch (modernError) {
            console.warn('Modern approach failed, trying fallback method:', modernError)
            const result = await client.ipAsset.register({
                nftContract,
                tokenId: tokenId.toString(),
                ipMetadata: {
                    ipMetadataURI: metadataUrl,
                    ipMetadataHash: metadataHashBytes32,
                    nftMetadataURI: metadataUrl,
                    nftMetadataHash: metadataHashBytes32
                },
                txOptions: {
                    waitForTransaction: true
                }
            })

            console.log('NFT registered as IP (without PIL terms):', result)

            return {
                success: true,
                ipId: result.ipId as Address,
                tokenId,
                licenseTermsId: BigInt(getLicenseTermsId(licenseType)),
                txHash: result.txHash
            }
        }
    } catch (error) {
        console.error('Error registering existing NFT as IP:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}