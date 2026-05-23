import { EnumUserRole } from '@statter/database';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ROLES_METADATA_KEY } from '../constants/metadata.constants';

export const Auth = (...roles: EnumUserRole[]): MethodDecorator & ClassDecorator =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), SetMetadata(ROLES_METADATA_KEY, roles));
