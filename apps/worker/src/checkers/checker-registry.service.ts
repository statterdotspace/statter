import { Injectable } from '@nestjs/common';
import { CheckJobPayload } from '@statter/utils';
import { Checker } from './checker.interface';
import { HttpsCheckerService } from './https-checker.service';

@Injectable()
export class CheckerRegistryService {
  private readonly checkerByType = new Map<string, Checker>();

  constructor(httpsCheckerService: HttpsCheckerService) {
    this.checkerByType.set(httpsCheckerService.type, httpsCheckerService);
  }

  resolve(job: CheckJobPayload): Checker | null {
    return this.checkerByType.get(job.type) ?? null;
  }
}
