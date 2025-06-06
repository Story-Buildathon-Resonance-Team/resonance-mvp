import { PinataSDK } from "pinata-web3"

// Function to get Pinata instance with the provided API key or fallback to env
function getPinataInstance(apiKey?: string): PinataSDK {
    const jwt = apiKey || process.env.NEXT_PUBLIC_PINATA_API_KEY || process.env.PINATA_API_KEY
    if (!jwt) {
        throw new Error('Pinata API key is required. Please provide it or set NEXT_PUBLIC_PINATA_API_KEY in environment.')
    }
    return new PinataSDK({ pinataJwt: jwt })
}

export async function uploadJSONToIPFS(jsonMetadata: Record<string, unknown>, apiKey?: string): Promise<string> {
    try {
        const pinata = getPinataInstance(apiKey)
        console.log('Uploading JSON to IPFS...')
        const { IpfsHash } = await pinata.upload.json(jsonMetadata)
        console.log('JSON uploaded successfully:', IpfsHash)
        return IpfsHash
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error)
        if (error instanceof Error) {
            throw new Error(`Failed to upload metadata to IPFS: ${error.message}`)
        }
        throw new Error('Failed to upload metadata to IPFS')
    }
}

export async function uploadFileToIPFS(file: File, apiKey?: string): Promise<string> {
    try {
        const pinata = getPinataInstance(apiKey)
        console.log('Uploading file to IPFS:', file.name, file.type, file.size)
        const { IpfsHash } = await pinata.upload.file(file)
        console.log('File uploaded successfully:', IpfsHash)
        return IpfsHash
    } catch (error) {
        console.error('Error uploading file to IPFS:', error)
        if (error instanceof Error) {
            throw new Error(`Failed to upload file to IPFS: ${error.message}`)
        }
        throw new Error('Failed to upload file to IPFS')
    }
}

// Legacy function for server-side uploads
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function uploadFileToIPFSFromPath(_filePath: string, _fileName: string, _fileType: string): Promise<string> {
    // This function is kept for backward compatibility but should not be used in browser
    throw new Error('uploadFileToIPFSFromPath is not available in browser environment. Use uploadFileToIPFS instead.')
}









