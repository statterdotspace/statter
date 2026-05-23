import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const existingUser = await this.usersService.findByEmail(request.body.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    return true;
  }
}
