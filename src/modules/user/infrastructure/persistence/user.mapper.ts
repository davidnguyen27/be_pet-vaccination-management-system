import { Prisma, RoleCode as PrismaRoleCode } from '../../../../../generated/prisma/client';
import { UserEntity } from '../../domain/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';
import { PhoneNumber } from '../../domain/value-objects/phone-number.value-object';

export type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>;

export class UserPrismaMapper {
  // Prisma model -> Domain entity
  static toDomain(raw: UserWithRole): UserEntity {
    return UserEntity.reconstitute(raw.id, {
      roleId: raw.roleId,
      roleCode: raw.role.code,
      email: Email.create(raw.email),
      password: Password.fromHashed(raw.password),
      fullName: raw.fullName,
      phoneNumber: raw.phoneNumber ? PhoneNumber.create(raw.phoneNumber) : null,
      avatarUrl: raw.avatarUrl,
      dob: raw.dob,
      isActive: raw.isActive,
      isDeleted: raw.isDeleted,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  // Domain entity -> Prisma model
  static toPrismaCreate(entity: UserEntity) {
    return {
      id: entity.id,
      role: { connect: { code: entity.roleCode as PrismaRoleCode } },
      email: entity.email,
      password: entity.password.toString(),
      fullName: entity.fullName,
      phoneNumber: entity.phoneNumber,
      avatarUrl: entity.avatarUrl,
      dob: entity.dob,
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  // Domain entity -> Prisma model for updates (partial)
  static toPrismaUpdate(entity: UserEntity) {
    return {
      role: { connect: { code: entity.roleCode as PrismaRoleCode } },
      password: entity.password.toString(),
      fullName: entity.fullName,
      phoneNumber: entity.phoneNumber,
      avatarUrl: entity.avatarUrl,
      dob: entity.dob,
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
      lastLoginAt: entity.lastLoginAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
