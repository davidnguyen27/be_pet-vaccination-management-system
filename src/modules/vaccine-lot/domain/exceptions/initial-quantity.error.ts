import { DomainException } from '@/shared/domain/domain.exception';

export class InitialQuantityRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'INITIAL_QUANTITY_REQUIRED';

  constructor() {
    super('Initial quantity is required');
  }
}

export class InitialQuantityInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'INITIAL_QUANTITY_INVALID';

  constructor() {
    super('Initial quantity must be an integer');
  }
}

export class InitialQuantityMustBePositiveError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'INITIAL_QUANTITY_MUST_BE_POSITIVE';

  constructor() {
    super('Initial quantity must be greater than 0');
  }
}

export class InitialQuantityLessThanQuantityOnHandError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'INITIAL_QUANTITY_LESS_THAN_QUANTITY_ON_HAND';

  constructor() {
    super('Initial quantity cannot be less than quantity on hand');
  }
}
