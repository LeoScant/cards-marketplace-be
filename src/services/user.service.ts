import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {recoverPersonalSignature} from 'eth-sig-util';
import {bufferToHex} from 'ethereumjs-util';
import {generateToken} from '../authentication-strategies/jwt-strategy';
import {UsersRepository} from '../repositories';
import {JwtService} from './jwt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @service(JwtService)
    public jwtService: JwtService,
  ) { }

  async getNonce(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}});
    return user?.nonce;
  }

  async login(walletAddress: string, signature: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    if (!signature) throw new Error('Signature is required');

    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}, include: ['likedCards', 'ownedCards']});
    if (!user) throw new Error('User not found');

    const nonce = user.nonce;
    if (!nonce) throw new Error('Nonce not found');

    // Verify the signature
    const msgBufferHex = bufferToHex(Buffer.from(nonce.toString(), 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    // The signature verification is successful if the recovered address matches the user's publicAddress
    if (address.toLowerCase() === walletAddress.toLowerCase()) {
      // Create a JWT or session identifier
      const token = await generateToken(walletAddress);
      return {token, user};
    } else {
      throw new HttpErrors.Unauthorized('Signature verification failed');
    }
  }

  async getLikedCards(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}, include: [{relation: 'likedCards'}]});
    return user?.likedCards || [];
  }

  async getUserByWalletAddress(walletAddress: string) {
    if (!walletAddress) throw new Error('Wallet address is required');
    const user = await this.usersRepository.findOne({where: {walletAddress: walletAddress}});
    return user;
  }
}
