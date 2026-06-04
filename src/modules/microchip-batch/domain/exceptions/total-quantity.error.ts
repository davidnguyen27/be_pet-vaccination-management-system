import { DomainException } from '@/shared/domain/domain.exception';

export class TotalQuantityInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'TOTAL_QUANTITY_INVALID';

  constructor() {
    super('Total quantity must be a non-negative integer');
  }
}
