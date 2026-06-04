import { DomainException } from '@/shared/domain/domain.exception';

export class DayOfWeekInvalidError extends DomainException {
  readonly statusCode = 400;
  readonly errorCode = 'DAY_OF_WEEK_INVALID';

  constructor() {
    super('Day of week is invalid');
  }
}
