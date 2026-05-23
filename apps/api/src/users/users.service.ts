import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrm } from '@statter/database';
import type { CreateUserParams, UpdateUserParams } from './types/user-params.types';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserOrm) private readonly usersRepo: Repository<UserOrm>) {}

  async findById(id: string) {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async findAuthByEmail(email: string) {
    return await this.usersRepo.findOne({
      where: { email },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        passwordHash: true,
        verifiedAt: true,
        isTwoFactorEnabled: true,
        role: true,
        provider: true,
      },
    });
  }

  async create(params: CreateUserParams) {
    return await this.usersRepo.save(params);
  }

  async update(id: string, params: UpdateUserParams) {
    await this.usersRepo.update(id, params);
    return await this.findById(id);
  }
}
