import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TOKEN_NAME } from '../../auth/constants/cookie.constants';
import { IJwtPayload } from '../../auth/types/jwt.types';
import { UsersService } from '../../users/users.service';

interface CheckSocketData {
  userId?: string;
}

type CheckSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  CheckSocketData
>;

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<CheckSocket>();
    const accessToken = this.extractAccessToken(client.handshake.headers.cookie ?? '');

    if (!accessToken) {
      throw new WsException('Unauthorized');
    }

    const secret = this.configService.get<string>('auth.jwtSecret') ?? '';
    if (!secret) {
      throw new WsException('JWT secret is not configured');
    }

    let payload: IJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<IJwtPayload>(accessToken, { secret });
    } catch (error) {
      this.logger.warn(`Socket authentication failed: ${(error as Error).message}`);
      throw new WsException('Unauthorized');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || user.deletedAt || !user.verifiedAt) {
      throw new WsException('Unauthorized');
    }

    client.data.userId = user.id;
    return true;
  }

  private extractAccessToken(cookieHeader: string): string | null {
    const cookieName = TOKEN_NAME.ACCESS_TOKEN;
    const escapedName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`));
    if (!match?.[1]) {
      return null;
    }

    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }
}
