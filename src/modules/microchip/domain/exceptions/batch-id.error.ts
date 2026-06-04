import { DomainException } from '@/shared/domain/domain.exception';

export class BatchIdRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'BATCH_ID_REQUIRED';

  constructor() {
    super('Batch ID is required');
  }
}

export class BatchIdNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'BATCH_ID_NOT_FOUND';

  constructor(batchId: string) {
    super(`Microchip batch ${batchId} not found`);
  }
}
