import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  async findByEmails(emails: string[]) {
    if (emails.length === 0) {
      return [];
    }

    return await this.usersRepo.find({ where: { email: In(emails) } });
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
    return this.usersRepo.save({ ...params, id });
  }

  async upsert(params: CreateUserParams) {
    const existingUser = await this.findByEmail(params.email);

    if (existingUser) {
      return await this.usersRepo.save({ ...params, id: existingUser.id });
    }

    return await this.usersRepo.save(params);
  }
}
