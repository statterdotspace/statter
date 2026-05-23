import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { EnumUserRole } from '@statter/database';
import { ROLES_METADATA_KEY } from '../constants/metadata.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<readonly EnumUserRole[]>(ROLES_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      Logger.log(user, 'RolesGuard');
      throw new UnauthorizedException('Unauthorized');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('You have no permission to access this.');
    }

    return true;
  }
}
