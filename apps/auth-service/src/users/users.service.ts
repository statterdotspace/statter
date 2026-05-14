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
    return await this.usersRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        verifiedAt: true,
        role: true,
      },
    });
  }

  async create(params: CreateUserParams) {
    return await this.usersRepo.save(params);
  }

  async update(id: string, params: UpdateUserParams) {
    return await this.usersRepo.update(id, params);
  }
}
