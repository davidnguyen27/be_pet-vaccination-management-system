import { DomainException } from '@/shared/domain/domain.exception';

export class MicrochipBatchNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'MICROCHIP_BATCH_NOT_FOUND';

  constructor(id: string) {
    super(`Microchip batch with id ${id} not found`);
  }
}

export class MicrochipBatchDeletedError extends DomainException {
  readonly statusCode = 410;
  readonly errorCode = 'MICROCHIP_BATCH_DELETED';

  constructor(id: string) {
    super(`Microchip batch ${id} has been deleted`);
  }
}
