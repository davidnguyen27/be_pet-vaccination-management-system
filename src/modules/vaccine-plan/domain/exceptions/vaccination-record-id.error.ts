import { DomainException } from '@/shared/domain/domain.exception';

export class VaccinationRecordIdNotFoundError extends DomainException {
  readonly statusCode = 404;
  readonly errorCode = 'VACCINATION_RECORD_ID_NOT_FOUND';

  constructor(vaccinationRecordId: string) {
    super(`Vaccination record ${vaccinationRecordId} not found`);
  }
}

export class VaccinationRecordIdDuplicateError extends DomainException {
  readonly statusCode = 409;
  readonly errorCode = 'VACCINATION_RECORD_ID_DUPLICATE';

  constructor(vaccinationRecordId: string) {
    super(`Vaccination record ${vaccinationRecordId} is already linked to another vaccine plan`);
  }
}
