import { BaseEntity } from '@/shared/domain/base.entity';
import { OwnerEntity } from '@/modules/owner/domain/owner.entity';
import { gender } from '../../../../generated/prisma/enums';

interface PetProps {
  id: string;
  ownerId: string;
  owner?: OwnerEntity;
  name: string;
  speciesId: string;
  sex: gender;
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
  owner?: OwnerEntity;
  name!: string;
  speciesId!: string;
  sex!: gender;
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
