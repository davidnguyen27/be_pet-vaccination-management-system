import { DomainException } from '@/shared/domain/domain.exception';

export class MicrochipCodeRequiredError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MICROCHIP_CODE_REQUIRED';

  constructor() {
    super('Microchip code is required');
  }
}

export class MicrochipCodeTooLongError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MICROCHIP_CODE_TOO_LONG';

  constructor() {
    super('Microchip code must be at most 50 characters');
  }
}

export class MicrochipCodeDuplicateError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'MICROCHIP_CODE_DUPLICATE';

  constructor(microchipCode: string) {
    super(`Microchip code ${microchipCode} already exists`);
  }
}
