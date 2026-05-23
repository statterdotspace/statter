import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/users.service';
import { UserOrm } from '@statter/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyPassword } from '../helpers/password.helpers';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, email: string, password: string): Promise<UserOrm> {
    const user = await this.usersService.findAuthByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isPasswordValid = user.passwordHash
      ? await verifyPassword(password, user.passwordHash)
      : false;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.verifiedAt) {
      throw new UnauthorizedException('Account not verified.');
    }

    request.user = user;

    return user;
  }
}
