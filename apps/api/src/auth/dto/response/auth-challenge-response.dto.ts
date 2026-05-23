import { Exclude, Expose } from 'class-transformer';
import { AuthFlowStatus } from '../../constants/auth-flow.constants';
import { VerificationType } from '../../constants/verification.constants';

@Exclude()
export class AuthChallengeResponseDto {
  @Expose()
  status!: AuthFlowStatus.OTP_REQUIRED;

  @Expose()
  verificationType!: VerificationType;

  @Expose()
  identifier!: string;
}
