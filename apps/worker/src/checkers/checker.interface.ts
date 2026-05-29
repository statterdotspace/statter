import { CheckJobPayload, CheckResultPayload } from '@statter/utils';

export interface Checker {
  readonly type: string;
  execute(job: CheckJobPayload): Promise<CheckResultPayload>;
}
