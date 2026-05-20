import { Prisma } from '../../../../../generated/prisma/client';
import { OwnerEntity } from '../../domain/owner.entity';

type OwnerWithUserRaw = Prisma.OwnerProfileGetPayload<{ include: { user: { include: { role: true } } } }>;
type OwnerWithoutUserRaw = Prisma.OwnerProfileGetPayload<object>;

export type OwnerRaw = OwnerWithoutUserRaw | OwnerWithUserRaw;

export class OwnerMapper {
  // Prisma model -> Domain entity
  static toDomain(raw: OwnerRaw): OwnerEntity {
    return OwnerEntity.reconstitute(raw.id, {
      userId: raw.userId,
      address: raw.address,
      locationLat: raw.locationLat,
      locationLng: raw.locationLng,
      totalPoints: raw.totalPoints,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  // Domain entity -> Prisma create payload
  static toPrismaCreate(entity: OwnerEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      address: entity.address,
      locationLat: entity.locationLat,
      locationLng: entity.locationLng,
      totalPoints: entity.totalPoints,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // Domain entity -> Prisma update payload
  static toPrismaUpdate(entity: OwnerEntity) {
    return {
      address: entity.address,
      locationLat: entity.locationLat,
      locationLng: entity.locationLng,
      totalPoints: entity.totalPoints,
      updatedAt: entity.updatedAt,
    };
  }
}
