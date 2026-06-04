import { DomainException } from '@/shared/domain/domain.exception';

export class MicrochipNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'MICROCHIP_NOT_FOUND';

  constructor(id: string) {
    super(`Microchip with id ${id} not found`);
  }
}

export class MicrochipDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'MICROCHIP_DELETED';

  constructor(id: string) {
    super(`Microchip ${id} has been deleted`);
  }
}
