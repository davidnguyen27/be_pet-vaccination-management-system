import { DomainException } from '@/shared/domain/domain.exception';

export class LotNoRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'LOT_NO_ERROR';

  constructor() {
    super('Vaccine lot number is required');
  }
}

export class LotNoDuplicateError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'LOT_NO_DUPLICATE';

  constructor(lotNo: string) {
    super(`Vaccine lot number ${lotNo} already exists`);
  }
}

export class LotNoNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'LOT_NO_NOT_FOUND';

  constructor(lotNo: string) {
    super(`Vaccine lot number ${lotNo} not found`);
  }
}

export class LotNoInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'LOT_NO_INVALID';

  constructor(lotNo: string) {
    super(`Vaccine lot number ${lotNo} is invalid`);
  }
}
