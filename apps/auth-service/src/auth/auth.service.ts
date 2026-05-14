import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './types/jwt.types';
import { ITokens } from './types/cookies.types';
import { TOKEN_TTL } from './constants/cookie.constants';

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
