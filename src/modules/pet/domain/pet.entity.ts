import { BaseEntity } from '@/shared/domain/base.entity';

interface PetProps {
  id: string;
  ownerId: string;
  name: string;
  speciesId: string;
  sex: string;
  dob: Date;
  weight: number;
  color: string;
  breed: string;
  note: string | null;
  isSterilized: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PetEntity extends BaseEntity {
  ownerId!: string;
  name!: string;
  speciesId!: string;
  sex!: string;
  dob!: Date;
  weight!: number;
  color!: string;
  breed!: string;
  note!: string | null;
  isSterilized!: boolean;

  constructor(props: PetProps) {
    super(props);
    Object.assign(this, props);
  }
}
