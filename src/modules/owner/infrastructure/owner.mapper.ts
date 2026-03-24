import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';
import { OwnerResponseDto } from '../application/dtos/owner-res.dto';
import { OwnerEntity } from '../domain/owner.entity';

export interface OwnerRaw {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    fullName?: string | null;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    dob?: Date | null;
    isActive: boolean;
    isDeleted: boolean;
    role?: {
      code: string;
    };
  };
  address: string | null;
  locationLat: number | null;
  locationLng: number | null;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OwnerMapper {
  static toDomain(raw: OwnerRaw): OwnerEntity {
    return new OwnerEntity({
      id: raw.id,
      user: raw.user
        ? ({
            id: raw.user.id,
            email: raw.user.email,
            fullName: raw.user.fullName,
            phoneNumber: raw.user.phoneNumber,
            avatarUrl: raw.user.avatarUrl,
            dob: raw.user.dob,
            isActive: raw.user.isActive,
            isDeleted: raw.user.isDeleted,
            roleCode: raw.user.role?.code ?? '',
          } as OwnerEntity['user'])
        : undefined,
      address: raw.address,
      locationLat: raw.locationLat,
      locationLng: raw.locationLng,
      totalPoints: raw.totalPoints,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toResponse(owner: OwnerEntity): OwnerResponseDto {
    return new OwnerResponseDto({
      id: owner.id,
      user: owner.user
        ? new UserResponseDto({
            id: owner.user.id,
            email: owner.user.email,
            fullName: owner.user.fullName ?? null,
            phoneNumber: owner.user.phoneNumber ?? null,
            avatarUrl: owner.user.avatarUrl ?? null,
            dob: owner.user.dob ?? null,
            roleCode: owner.user.roleCode,
            isActive: owner.user.isActive,
          })
        : null,
      address: owner.address,
      locationLat: owner.locationLat,
      locationLng: owner.locationLng,
      totalPoints: owner.totalPoints,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
    });
  }
}
