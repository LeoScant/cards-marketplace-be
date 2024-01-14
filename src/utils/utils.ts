import {HttpErrors} from '@loopback/rest';
import {randomStringForEntropy} from '@stablelib/random';
import axios from 'axios';
import {ethers} from 'ethers';
import contractABI from './TheCardsEmporiumContractAbi.json';
const JWT = `Bearer ${process.env.PINATA_JWT}`;
const contractAddress = '0xFf4fA59707B0C9A531Cf34eDCfC53E71E030471B';
const ipfsBaseUrl = 'https://brown-pregnant-alpaca-857.mypinata.cloud/ipfs/';

export const generateNonce = (): string => {
  const nonce = randomStringForEntropy(96);
  if (!nonce || nonce.length < 8) {
    throw new Error('Error during nonce creation.');
  }
  return nonce;
};

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
        Authorization: JWT
      }
    });
    return res.data
  } catch (error) {
    console.log(error);
  }
}

function getProvider(): ethers.Provider {
  return ethers.getDefaultProvider("sepolia", {
    alchemy: process.env.ALCHEMY_API_KEY,
  });
}

export function getWallet(): ethers.Wallet {
  if (!process.env.ETH_PRIVATE_KEY) throw new Error("ETH_PRIVATE_KEY is not set");

  return new ethers.Wallet(process.env.ETH_PRIVATE_KEY, getProvider());
}

const getContract = () => {
  const wallet = getWallet();
  return new ethers.Contract(contractAddress, contractABI, wallet);
}

export const mintNFT = async (ipfsHash: string, toAddress: string) => {
  const contract = getContract()
  try {
    let rawTxn = await contract.mint(toAddress, ipfsBaseUrl + ipfsHash)
    console.log('Transaction:', rawTxn);
    const receipt = await rawTxn.wait()
    for (const event of receipt.logs) {
      // Assumi che l'evento 'NFTMinted' sia il primo log; modifica come necessario
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
