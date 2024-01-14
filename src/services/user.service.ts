import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {recoverPersonalSignature} from 'eth-sig-util';
import {bufferToHex} from 'ethereumjs-util';
import {generateToken} from '../authentication-strategies/jwt-strategy';
import {UsersRepository} from '../repositories';
import {generateNonce} from '../utils/utils';
import {JwtService} from './jwt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @service(JwtService)
    public jwtService: JwtService,
  ) { }

  /**
   * Retrieves the nonce for a given wallet address.
   * If the user does not exist, a new user is created.
   * @param walletAddress The wallet address for which to retrieve the nonce.
   * @returns The nonce value of the user.
   * @throws Error if the wallet address is not provided.
   */
  async getNonce(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    let user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}});
    if (!user) user = await this.createUser(walletAddress);
    return user?.nonce;
  }

  /**
   * Creates a new user with the specified wallet address.
   * @param walletAddress The wallet address of the user.
   * @returns The newly created user.
   * @throws Error if the wallet address is not provided.
   */
  async createUser(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    const nonce = generateNonce();;
    const newUser = await this.usersRepository.create({walletAddress: walletAddress, nonce});
    return newUser;
  }

  /**
   * Logs in a user by verifying the wallet address and signature.
   *
   * @param walletAddress - The wallet address of the user.
   * @param signature - The signature provided by the user.
   * @returns An object containing the generated token and the user information if the login is successful.
   * @throws Error if the wallet address or signature is missing, or if the user is not found.
   * @throws HttpErrors.Unauthorized if the signature verification fails.
   */
  async login(walletAddress: string, signature: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    if (!signature) throw new Error('Signature is required');

    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}, include: ['likedCards', 'ownedCards']});
    if (!user) throw new Error('User not found');

    const nonce = user.nonce;
    if (!nonce) throw new Error('Nonce not found');

    // Verify the signature
    const msgBufferHex = bufferToHex(Buffer.from(nonce, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    // The signature verification is successful if the recovered address matches the user's publicAddress
    if (address.toLowerCase() === walletAddress.toLowerCase()) {
      // Create a JWT or session identifier
      const token = await generateToken(walletAddress);

      // Update the user's nonce value
      const nonce = generateNonce();
      await this.usersRepository.updateById(user.id, {nonce});

      return {token, user};
    } else {
      throw new HttpErrors.Unauthorized('Signature verification failed');
    }
  }

  /**
   * Retrieves the liked cards for a given user.
   * @param walletAddress - The wallet address of the user.
   * @returns An array of liked cards.
   * @throws Error if the wallet address is not provided.
   */
  async getLikedCards(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}, include: [{relation: 'likedCards'}]});
    return user?.likedCards || [];
  }

  /**
   * Retrieves a user by his wallet address.
   * @param walletAddress - The wallet address of the user.
   * @returns The user object if found, otherwise null.
   * @throws Error if the wallet address is not provided.
   */
  async getUserByWalletAddress(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}});
    return user;
  }
}
