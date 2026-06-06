import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrm } from '@statter/database';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersListener } from './listeners/users.listener';
import { VerificationCodeService } from '../auth/services/verification-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrm])],
  controllers: [UsersController],
  providers: [UsersService, VerificationCodeService, UsersListener],
  exports: [UsersService],
})
export class UsersModule {}
