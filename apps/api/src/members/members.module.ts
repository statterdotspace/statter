import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMemberOrm } from '@statter/database';
import { MembersService } from './members.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceMemberOrm])],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
