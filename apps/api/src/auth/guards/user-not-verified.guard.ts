import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserNotVerifiedGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user ?? (await this.usersService.findByEmail(request.body.email));

    if (!user) {
      return true;
    }

    if (!user.verifiedAt) {
      throw new UnauthorizedException('User is not verified');
    }

    return true;
  }
}
