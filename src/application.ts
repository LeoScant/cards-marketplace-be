import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import path from 'path';
import {JwtStrategy} from './authentication-strategies/jwt-strategy';
import {
  TokenServiceBindings
} from './keys';
import {MySequence} from './sequence';
require('dotenv').config();

export {ApplicationConfig};

export class CardsMarketplaceBeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.setupBinding();
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JwtStrategy)
  }

  setupBinding(): void {
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.TOKEN_SECRET_VALUE ?? '');
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.TOKEN_EXPIRES_IN_VALUE ?? '8h');
  }
}
