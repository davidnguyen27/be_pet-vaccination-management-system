import type { User, Role } from '../../../../../generated/prisma/client';
import { UserEntity } from '../../domain/entities/user.entity';

type PrismaUserWithRole = User & { role: Role };

export class AuthMapper {
  static toDomain(raw: PrismaUserWithRole): UserEntity {
    return new UserEntity({
      id: raw.userId,
      email: raw.email,
      passwordHash: raw.password,
      fullName: raw.fullName,
      phoneNumber: raw.phoneNumber,
      avatarUrl: raw.avatarUrl,
      dob: raw.dob,
      isActive: raw.isActive,
      isDeleted: raw.isDeleted,
      roleId: raw.roleId,
      roleCode: raw.role.code,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }
}
