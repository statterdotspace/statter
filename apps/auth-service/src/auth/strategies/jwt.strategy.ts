import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { IJwtPayload } from '../types/jwt.types';
import { refreshTokenExtractor } from '../helpers/token-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromExtractors([refreshTokenExtractor]),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('auth.jwtSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    if (!user.verifiedAt) {
      throw new UnauthorizedException('User not verified');
    }

    return user;
  }
}
