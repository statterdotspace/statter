import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_TTL } from './constants/cookie.constants';
import { ITokens } from './types/cookies.types';
import { IJwtPayload } from './types/jwt.types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async issueTokens(payload: IJwtPayload): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: TOKEN_TTL.ACCESS_TOKEN }),
      this.jwtService.signAsync(payload, { expiresIn: TOKEN_TTL.REFRESH_TOKEN }),
    ]);

    return { accessToken, refreshToken };
  }
}
