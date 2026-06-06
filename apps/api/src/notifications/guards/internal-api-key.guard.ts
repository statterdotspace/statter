import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const provided = request.headers['x-internal-api-key'];
    const expected = this.configService.getOrThrow<string>('app.internalApiKey');

    if (!provided || provided !== expected) {
      throw new UnauthorizedException('Invalid internal API key');
    }

    return true;
  }
}
