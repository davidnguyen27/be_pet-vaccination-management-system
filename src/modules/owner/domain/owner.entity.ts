import { UserEntity } from '@/modules/user/domain/user.entity';
import { BaseEntity } from '@/shared/domain/base.entity';

interface OwnerProps {
  id: string;
  user?: UserEntity;
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class OwnerEntity extends BaseEntity {
  user?: UserEntity;
  address!: string | null;
  locationLat!: number | null;
  locationLng!: number | null;
  totalPoints!: number;

  constructor(props: OwnerProps) {
    super(props);
    Object.assign(this, props);
  }
}
