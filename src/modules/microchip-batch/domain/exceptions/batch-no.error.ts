import { DomainException } from '@/shared/domain/domain.exception';

export class BatchNoRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'BATCH_NO_REQUIRED';

  constructor() {
    super('Batch number is required');
  }
}

export class BatchNoTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'BATCH_NO_TOO_LONG';

  constructor() {
    super('Batch number must be at most 80 characters');
  }
}

export class BatchNoDuplicateError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'BATCH_NO_DUPLICATE';

  constructor(batchNo: string) {
    super(`Batch number ${batchNo} already exists`);
  }
}
