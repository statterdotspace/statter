import { Injectable } from '@nestjs/common';
import { createHash, randomInt } from 'crypto';
import { RedisService } from '../../core/modules/redis/redis.service';
import { VerificationCheck, VerificationType } from '../constants/verification.constants';

@Injectable()
export class VerificationCodeService {
  static readonly OTP_LENGTH = 6;
  static readonly OTP_TTL_MS = 5 * 60 * 1000;

  constructor(private readonly redisService: RedisService) {}

  async create(
    identifier: string,
    type: VerificationType = VerificationType.EMAIL
  ): Promise<string> {
    const { code, hash } = this.generateCode();

    await this.redisService.set(
      this.getOtpKey(identifier, type),
      hash,
      VerificationCodeService.OTP_TTL_MS
    );

    return code;
  }

  async verify(
    identifier: string,
    code: string,
    type: VerificationType
  ): Promise<VerificationCheck> {
    const key = this.getOtpKey(identifier, type);
    const hash = await this.redisService.get(key);

    if (!hash || typeof hash !== 'string') {
      return VerificationCheck.OTP_NOT_FOUND;
    }

    const expectedHash = createHash('sha256').update(code.toString()).digest('hex');

    if (hash !== expectedHash) {
      return VerificationCheck.OTP_INVALID;
    }

    await this.redisService.del(key);
    return VerificationCheck.VERIFIED;
  }

  private getOtpKey(identifier: string, type: VerificationType): string {
    return `otp:${identifier}:${type}`;
  }

  private generateCode(): { code: string; hash: string } {
    const code = randomInt(0, 10 ** VerificationCodeService.OTP_LENGTH)
      .toString()
      .padStart(VerificationCodeService.OTP_LENGTH, '0');
    const hash = createHash('sha256').update(code).digest('hex');

    return { code, hash };
  }
}
