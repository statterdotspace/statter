import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { CheckJobPayload, CheckResultPayload } from '@statter/utils';
import { Checker } from './checker.interface';

@Injectable()
export class HttpsCheckerService implements Checker {
  readonly type = 'https';

  async execute(job: CheckJobPayload): Promise<CheckResultPayload> {
    const startedAt = Date.now();

    try {
      const response = await axios.get<ArrayBuffer>(job.url, {
        timeout: job.timeoutMs,
        responseType: 'arraybuffer',
        validateStatus: () => true,
      });

      const latencyMs = Date.now() - startedAt;
      const statusCode = response.status;
      const responseSizeBytes = this.detectResponseSize(response.data, response.headers);
      const isExpectedStatus = statusCode === job.expectedStatus;
      const isDegraded =
        isExpectedStatus &&
        typeof job.degradedThresholdMs === 'number' &&
        latencyMs > job.degradedThresholdMs;

      return {
        monitorId: job.monitorId,
        checkedAt: new Date().toISOString(),
        region: job.region,
        status: !isExpectedStatus ? 'down' : isDegraded ? 'degraded' : 'up',
        statusCode,
        latencyMs,
        responseSizeBytes,
        errorMessage: isExpectedStatus
          ? isDegraded
            ? `Response too slow: ${latencyMs}ms (threshold: ${job.degradedThresholdMs}ms)`
            : null
          : `Unexpected HTTP status. Expected ${job.expectedStatus}, got ${statusCode}`,
      };
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const axiosError = error as AxiosError;
      const isTimeoutError = axiosError.code === 'ECONNABORTED';

      return {
        monitorId: job.monitorId,
        checkedAt: new Date().toISOString(),
        region: job.region,
        status: isTimeoutError ? 'timeout' : 'down',
        statusCode: axiosError.response?.status ?? null,
        latencyMs,
        responseSizeBytes: null,
        errorMessage: axiosError.message,
      };
    }
  }

  private detectResponseSize(data: ArrayBuffer, headers: Record<string, unknown>): number | null {
    const contentLength = headers['content-length'];
    if (!contentLength || typeof contentLength !== 'string') {
      return null;
    }
    const parsed = Number(contentLength);

    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }

    return data.byteLength;
  }
}
