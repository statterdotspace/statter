import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response/user-response.dto';
import { AuthFlowStatus } from '../../constants/auth-flow.constants';

@Exclude()
export class AuthenticatedResponseDto {
  @Expose()
  status!: AuthFlowStatus.AUTHENTICATED;

  @Expose()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;
}
