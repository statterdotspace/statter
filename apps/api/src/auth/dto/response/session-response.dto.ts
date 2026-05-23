import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response/user-response.dto';

@Exclude()
export class SessionResponseDto {
  @Expose()
  user: UserResponseDto;
}
