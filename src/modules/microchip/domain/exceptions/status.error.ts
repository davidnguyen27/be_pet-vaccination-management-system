import { DomainException } from '@/shared/domain/domain.exception';

export class MicrochipStatusInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'MICROCHIP_STATUS_INVALID';

  constructor() {
    super('Microchip status is invalid');
  }
}
