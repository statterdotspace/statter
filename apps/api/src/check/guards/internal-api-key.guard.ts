import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const configuredApiKey = this.configService.get<string>('internal.apiKey') ?? '';
    if (!configuredApiKey) {
      throw new ServiceUnavailableException('INTERNAL_API_KEY is not configured');
    }

    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const rawHeader = request.headers['x-internal-api-key'];
    const providedApiKey = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    if (!providedApiKey || providedApiKey !== configuredApiKey) {
      throw new UnauthorizedException('Invalid internal API key');
    }

    return true;
  }
}
