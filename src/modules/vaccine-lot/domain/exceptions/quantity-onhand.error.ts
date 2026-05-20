import { DomainException } from '@/shared/domain/domain.exception';

export class QuantityOnHandRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'QUANTITY_ON_HAND_REQUIRED';

  constructor() {
    super('Quantity on hand is required');
  }
}

export class QuantityOnHandInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'QUANTITY_ON_HAND_INVALID';

  constructor() {
    super('Quantity on hand must be an integer');
  }
}

export class QuantityOnHandNegativeError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'QUANTITY_ON_HAND_NEGATIVE';

  constructor() {
    super('Quantity on hand cannot be negative');
  }
}

export class QuantityOnHandExceedsInitialQuantityError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'QUANTITY_ON_HAND_EXCEEDS_INITIAL_QUANTITY';

  constructor() {
    super('Quantity on hand cannot exceed initial quantity');
  }
}

export class QuantityOnHandInsufficientError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'QUANTITY_ON_HAND_INSUFFICIENT';

  constructor() {
    super('Quantity on hand is not enough');
  }
}
