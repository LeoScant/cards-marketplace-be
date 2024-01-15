import {HttpErrors} from '@loopback/rest';
import {randomStringForEntropy} from '@stablelib/random';
import axios from 'axios';
import {ethers, Provider} from 'ethers';
import contractABI from './TheCardsEmporiumContractAbi.json';
const ipfsBaseUrl = 'https://brown-pregnant-alpaca-857.mypinata.cloud/ipfs/';

/**
 * Generates a nonce string.
 * @returns The generated nonce string.
 * @throws Error if there is an error during nonce creation.
 */
export const generateNonce = (): string => {
  const nonce = randomStringForEntropy(96);
  if (!nonce || nonce.length < 8)
    throw new Error('Error during nonce creation.');

  return `Welcome to The Cards Emporium - ${nonce}`;
};

/**
 * Pins a JSON object to IPFS.
 * @param title - The title of the object.
 * @param description - The description of the object.
 * @param imageUrl - The URL of the image associated with the object (optional).
 * @returns The response data from the IPFS API.
 * @throws {HttpErrors.InternalServerError} If there is an error pinning to IPFS.
 */
export const pinJSONToIPFS = async (title: string, description: string, imageUrl?: string) => {
  const data = JSON.stringify({
    pinataContent: {
      name: title,
      description: description,
      image: imageUrl,
    },
    pinataMetadata: {
      name: `${title}.json`
    }
  })

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      }
    });
    return res.data
  } catch (error) {
    console.log(error);
    throw new HttpErrors.InternalServerError('Error pinning to IPFS');
  }
}

/**
 * Retrieves the provider for the specified network using the Alchemy API key.
 * @returns The provider object.
 */
function getProvider(): Provider {
  const network = 'sepolia';
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  return new ethers.AlchemyProvider(network, alchemyApiKey);
}

/**
 * Retrieves the wallet using the ETH_PRIVATE_KEY environment variable.
 * @returns The ethers.Wallet object.
 * @throws Error if ETH_PRIVATE_KEY is not set.
 */
export function getWallet(): ethers.Wallet {
  if (!process.env.ETH_PRIVATE_KEY) throw new Error("ETH_PRIVATE_KEY is not set");

  return new ethers.Wallet(process.env.ETH_PRIVATE_KEY, getProvider());
}

const getContract = () => {
  const wallet = getWallet();
  const contractAddress = process.env.CONTRACT_ADDRESS || '';
  return new ethers.Contract(contractAddress, contractABI, wallet);
}

/**
 * Mints an NFT by calling the contract's mint function with the given IPFS hash and recipient address.
 *
 * @param ipfsHash - The IPFS hash of the NFT content.
 * @param toAddress - The address of the recipient.
 * @returns The token ID of the minted NFT.
 * @throws {HttpErrors.InternalServerError} If there is an error minting the NFT.
 */
export const mintNFT = async (ipfsHash: string, toAddress: string) => {
  const contract = getContract()
  try {
    let rawTxn = await contract.mint(toAddress, ipfsBaseUrl + ipfsHash)
    console.log('Transaction:', rawTxn);
    const receipt = await rawTxn.wait()
    for (const event of receipt.logs) {
      let parsedEvent = contract.interface.parseLog(event);
      if (parsedEvent && parsedEvent.name === 'NFTMinted') {
        console.log('NFT Minted with Token ID:', parsedEvent.args.tokenId.toString());
        return parsedEvent.args.tokenId;
      }
    }
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new HttpErrors.InternalServerError('Error minting NFT');
  }
}

/**
 * Burns an NFT with the specified tokenId.
 *
 * @param tokenId - The ID of the NFT to burn.
 * @returns The raw transaction object.
 * @throws {HttpErrors.InternalServerError} If there is an error burning the NFT.
 */
export const burnNFT = async (tokenId: string) => {
  const contract = getContract()
  try {
    let rawTxn = await contract.burn(tokenId)
    console.log('Transaction:', rawTxn);
    return rawTxn
  } catch (error) {
    console.error('Error burning NFT:', error);
    throw new HttpErrors.InternalServerError('Error burning NFT');
  }
}

/**
 * Retrieves the approved address for a given token ID.
 *
 * @param tokenId - The ID of the token.
 * @returns A Promise that resolves to the approved address.
 * @throws {HttpErrors.InternalServerError} If there is an error retrieving the approved address.
 */
export const getApproved = async (tokenId: string) => {
  const contract = getContract()
  try {
    let approved = await contract.getApproved(tokenId)
    console.log('Approved:', approved);
    return approved
  } catch (error) {
    console.error('Error getting approved:', error);
    throw new HttpErrors.InternalServerError('Error getting approved');
  }
}

/**
 * Transfers an NFT from one address to another safely.
 *
 * @param from The address of the current owner of the NFT.
 * @param to The address of the new owner of the NFT.
 * @param tokenId The ID of the NFT to be transferred.
 * @returns A Promise that resolves to the raw transaction object.
 * @throws {HttpErrors.InternalServerError} If there is an error during the transfer process.
 */
export const safeTransferFrom = async (from: number, to: number, tokenId: string) => {
  const contract = getContract()
  try {
    let rawTxn = await contract.safeTransferFrom(from, to, tokenId)
    console.log('Transaction:', rawTxn);
    return rawTxn
  } catch (error) {
    console.error('Error safeTransferFrom NFT:', error);
    throw new HttpErrors.InternalServerError('Error safeTransferFrom NFT');
  }
}
