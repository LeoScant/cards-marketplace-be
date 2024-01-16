# cards-marketplace-be

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html).
It's the backend for the application 'The Cards Emporium", a marketplace to create and trade cards.

## API Endpoints

The API endpoints are located in `src/controllers`:

- `/cards`: This endpoint is used for operations related to cards:
  - `POST /cards`: Create a new card, minting an NFT.
  - `GET /cards`: Get all cards.
  - `GET /cards/{id}`: Get a specific card by its ID.
  - `DELETE /cards/{id}`: Delete a card and burn the related NFT.

- `/users`: This endpoint is used for operations related to users:
  - `POST /users`: Create a new user.
  - `GET /users`: Get all users.
  - `GET /users/{walletAddress}`: Get a specific user by their wallet address.

- `/trades`: This endpoint is used for operations related to trades:
  - `POST /trades`: Create a new trade.
  - `GET /trades`: Get all trades.
  - `GET /trades/{id}`: Get a specific trade by its ID.


## Blockchain Integration

The blockchain integration is handled in the `src/utils/utils.ts` file. This file contains several utility functions that interact with the Ethereum blockchain using the ethers.js library.

- `generateNonce`: This function generates a nonce string. A nonce is a random string that is used once and is often used in cryptographic functions to ensure security.

- `pinJSONToIPFS`: This function pins a JSON object to IPFS (InterPlanetary File System). The pinned data can then be accessed via an IPFS gateway.

- `mintNFT`: This function is used to mint a new NFT (Non-Fungible Token). It takes the recipient's address and the token URI (which points to the token's metadata on IPFS) as arguments. The function creates a transaction to mint the NFT and sends it to the Ethereum network.

- `burnNFT`: This function is used to burn an NFT. It takes the token ID as an argument. The function creates a transaction to burn the NFT and sends it to the Ethereum network.

- `getApproved`: This function is used to get the approved address for an NFT. It takes the token ID as an argument and returns the address that is approved to transfer this NFT.

- `safeTransferFrom`: This function is used to safely transfer an NFT from one address to another. It takes the sender's address, the recipient's address, and the token ID as arguments. The function creates a transaction to transfer the NFT and sends it to the Ethereum network.

The file also imports a contract ABI (Application Binary Interface) from `TheCardsEmporiumContractAbi.json`. The ABI is a JSON file that describes how to interact with the Ethereum contract. It's used by the ethers.js library to create a contract instance that can be used to call the contract's methods.

The `ethers` library is used to interact with the Ethereum blockchain. It's used to create providers (which connect to the Ethereum network), signers (which are used to sign transactions), and contract instances (which are used to interact with contracts deployed on the Ethereum network).

The `axios` library is used to make HTTP requests to the Pinata API, which is used to pin data to IPFS.

Remember to set the `PINATA_JWT` environment variable to your Pinata JWT for the IPFS integration to work.

## Environment Variables

This project uses environment variables for configuration. These are stored in a `.env` file at the root of the project. To create this file fill in the values for each variable:

- TOKEN_SECRET_VALUE: The secret value used to sign and verify JWT tokens.
- TOKEN_EXPIRES_IN: The duration that JWT tokens should be valid for.
- DB_HOST: The host of your database.
- DB_PORT: The port your database is running on.
- DB_NAME: The name of your database.
- DB_USERNAME: The username used to connect to your database.
- DB_PASSWORD: The password used to connect to your database.
- PINATA_JWT: Your Pinata JWT, used for the IPFS integration.
- ETH_PRIVATE_KEY: The private key of your Ethereum wallet.
- ETH_ADDRESS: The address of your Ethereum wallet.
- ALCHEMY_API_KEY: Your Alchemy API key, used to connect to the Ethereum network.
- CONTRACT_ADDRESS: The address of the Ethereum contract you're interacting with.


## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

## Run the application

```sh
npm start
```

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Tests

There tests are in src/__tests__ and you can run them with
```sh
npm test
```
