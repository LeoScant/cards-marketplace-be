# The Cards Emporium - Backend Application

This application is the backend for the application 'The Cards Emporium", a marketplace to create and trade cards.

## Technologies Used

- `Loopback 4`: This is a highly extensible Node.js and TypeScript framework for building APIs and microservices. It's used in this project to create the API endpoints and handle the business logic.

- `Ethers.js`: This is a JavaScript library for interacting with the Ethereum blockchain. It's used in this project to mint, burn and transfer NFTs.

- `axios`: This is a promise-based HTTP client for the browser and Node.js. It's used in this project to make HTTP requests to the Pinata API for upload data to IPFS.

## API Endpoints

The API endpoints are located in `src/controllers`:

- `/cards`: This endpoint is used for operations related to cards:
  - `GET /all`: Get all cards.
  - `GET /`: Get cards owned by the authenticated user.
  - `POST /{cardId}/like`: Add the card to the user's liked cards.
  - `POST /`: Create a card for the user and mint the NFT
  - `DEL /{cardId}`: Delete specified card

- `/users`: This endpoint is used for operations related to users:
  - `GET /getNonce`: Get the user's nonce, if doesn't exist create the user.
  - `POST /login`: Login the user.
  - `GET /likedCards`: Get the user's liked card list.

- `/trades`: This endpoint is used for operations related to trades:
  - `GET /`: Get user's trade's offers.
  - `POST /`: Create a new trade.
  - `POST /{tradeOfferId}/accept`: Accept a trade offer, checking if both user's approved the transaction on blockchain, transfering the NFTs and changing the ownerId on the card.


  The application logic related to the API endpoints can be found in the ```src/services``` directory. This directory contains the service files that handle the business logic and data manipulation for each endpoint.

## Database

The backend application uses Postgres 14 as the database. The database schema includes the following tables:

- `Users`: Stores all the users' data.
- `Cards`: Stores all the cards' data.
- `LikedCards`: Represents a many-to-many relationship between Users and Cards, storing information about the cards that a user has liked.
- `TradeOffers`: Represents a many-to-many relationship, storing information about all the trade offers made by users.

The database schema design ensures efficient storage and retrieval of data for the marketplace application. You can find all the info about the database models in ```src/models``` and the datasource in ```src/datasources```.

## Blockchain Integration

The blockchain integration is handled in the `src/utils/utils.ts` file. This file contains several utility functions that interact with the Ethereum blockchain using the ethers.js library.

- `generateNonce`: This function generates a nonce string. A nonce is a random string that is used once and is often used in cryptographic functions to ensure security.

- `pinJSONToIPFS`: This function uploads a JSON object to IPFS (InterPlanetary File System). The pinned data can then be accessed via an IPFS gateway.

- `mintNFT`: This function is used to mint a new NFT (Non-Fungible Token). It takes the recipient's address and the token URI (which points to the token's metadata on IPFS) as arguments. The function creates a transaction to mint the NFT and sends it to the Ethereum network, then from the event emitted from the smart contract retrieves the Token ID and saves it in the card record.

- `burnNFT`: This function is used to burn an NFT. It takes the Token ID as an argument. The function creates a transaction to burn the NFT and sends it to the Ethereum network.

- `getApproved`: This function is used to get the approved address for an NFT. It takes the token ID as an argument and returns the address that is approved to transfer this NFT.

- `safeTransferFrom`: This function is used to safely transfer an NFT from one address to another. It takes the sender's address, the recipient's address, and the token ID as arguments. The function creates a transaction to transfer the NFT and sends it to the Ethereum network.

The file also imports a contract ABI (Application Binary Interface) from `TheCardsEmporiumContractAbi.json`. The ABI is a JSON file that describes how to interact with the Ethereum contract. It's used by the ethers.js library to create a contract instance that can be used to call the contract's methods.

Remember to set the `PINATA_JWT` environment variable to your Pinata JWT for the IPFS integration to work.

## Installation and Setup

1. Clone the repository: Use `git clone https://github.com/LeoScant/cards-marketplace-be` to clone the repository to your local machine.

2. Install dependencies: Navigate into the cloned repository directory and run `npm install` to install the necessary dependencies.

3. Set up environment variables: Create a `.env` file at the root of the project and fill in the necessary environment variables. Refer to the "Environment Variables" section for more details.

4. Run `npm start` and open http://localhost:8000 in your browser.

## Tests

The tests are in src/__tests__ and you can run them with
```sh
npm test
```

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
