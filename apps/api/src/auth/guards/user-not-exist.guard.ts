import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserNotExistsGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.findByEmail(request.body.email);

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    request.user = user;

    return true;
  }
}
