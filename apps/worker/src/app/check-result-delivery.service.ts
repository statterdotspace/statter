import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { CheckResultPayload } from '@statter/utils';

@Injectable()
export class CheckResultDeliveryService {
  private readonly logger = new Logger(CheckResultDeliveryService.name);

  async deliver(checkResult: CheckResultPayload): Promise<{ success: true } | { success: false; requeue: boolean }> {
    const apiBaseUrl = process.env['WORKER_API_BASE_URL'] ?? 'http://localhost:4000/api';
    const internalApiKey = process.env['WORKER_INTERNAL_API_KEY'] ?? '';

    try {
      await axios.post(
        `${apiBaseUrl}/internal/check-results`,
        checkResult,
        {
          timeout: 10000,
          headers: {
            'x-internal-api-key': internalApiKey,
          },
        }
      );

      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      this.logger.warn(
        `Failed to deliver check result for monitor=${checkResult.monitorId} status=${statusCode ?? 'network'} message="${axiosError.message}"`
      );

      if (!statusCode || statusCode >= 500) {
        return { success: false, requeue: true };
      }

      return { success: false, requeue: false };
    }
  }
}
