import { BaseEntity } from '@/shared/domain/base.entity';

interface SpeciesProps {
  id: string;
  code: string;
  name: string;
  defaultVaccinePlan: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class SpeciesEntity extends BaseEntity {
  code!: string;
  name!: string;
  defaultVaccinePlan!: boolean;

  constructor(props: SpeciesProps) {
    super(props);
    Object.assign(this, props);
  }
}
