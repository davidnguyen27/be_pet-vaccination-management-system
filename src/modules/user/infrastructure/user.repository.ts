import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { CreateUserData, UpdateUserData, GetUsersFilter, IUserRepository } from '../domain/i-user.repository';
import { UserEntity } from '../domain/user.entity';
import { UserMapper } from './user.mapper';
import { Prisma } from '../../../../generated/prisma/client';
import { RoleCode } from '@/enums';
import { PaginatedResult } from '@/shared/domain/paginated-result.type';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userInclude = {
    role: true,
    ownerProfile: true,
    vetProfile: true,
    staffProfile: true,
  };

  private buildDefaultStaffCode(userId: string): string {
    return `STAFF-${userId.slice(0, 8).toUpperCase()}`;
  }

  private buildDefaultVetLicenseNo(userId: string): string {
    return `LIC-${userId.slice(0, 8).toUpperCase()}`;
  }

  private buildDefaultCitizenId(prefix: 'STAFF' | 'VET', userId: string): string {
    return `${prefix}-${userId.slice(0, 12).toUpperCase()}`;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: this.userInclude,
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id: userId },
      include: this.userInclude,
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findAll(filter: GetUsersFilter): Promise<PaginatedResult<UserEntity>> {
    const { search, roleCode, isActive, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause({ search, roleCode, isActive });

    const [raws, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: this.userInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: raws.map(raw => UserMapper.toDomain(raw)),
      total,
      page,
      limit,
    };
  }

  async ensureOwnerProfile(userId: string): Promise<void> {
    await this.prisma.ownerProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const raw = await this.prisma.$transaction(async tx => {
      const role = await tx.role.findUniqueOrThrow({
        where: { code: data.roleCode },
      });

      const user = await tx.user.create({
        data: {
          email: data.email,
          password: data.passwordHash,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl,
          dob: data.dob,
          roleId: role.id,
          isActive: data.isActive ?? true,
        },
      });

      await this.createRoleProfile(tx, user.id, data.roleCode);

      return tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: this.userInclude,
      });
    });

    return UserMapper.toDomain(raw);
  }

  async update(data: UpdateUserData): Promise<UserEntity> {
    const role = data.roleCode ? await this.prisma.role.findUniqueOrThrow({ where: { code: data.roleCode } }) : null;

    const raw = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        ...(data.passwordHash && { password: data.passwordHash }),
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
        dob: data.dob,
        ...(role && { roleId: role.id }),
        updatedAt: new Date(),
      },
      include: this.userInclude,
    });

    return UserMapper.toDomain(raw);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true, deletedAt: new Date(), isActive: false },
    });
  }

  private buildWhereClause(filter: Pick<GetUsersFilter, 'search' | 'roleCode' | 'isActive'>) {
    return {
      isDeleted: false,
      ...(filter.isActive !== undefined && { isActive: filter.isActive }),
      ...(filter.roleCode && { role: { code: filter.roleCode } }),
      ...(filter.search && {
        OR: [
          { email: { contains: filter.search, mode: 'insensitive' as const } },
          { fullName: { contains: filter.search, mode: 'insensitive' as const } },
          { phoneNumber: { contains: filter.search, mode: 'insensitive' as const } },
        ],
      }),
    };
  }

  private async createRoleProfile(tx: Prisma.TransactionClient, userId: string, roleCode: RoleCode): Promise<void> {
    switch (roleCode) {
      case RoleCode.OWN:
        await tx.ownerProfile.create({ data: { userId } });
        return;

      case RoleCode.STAFF:
        await tx.staffProfile.create({
          data: {
            userId,
            code: this.buildDefaultStaffCode(userId),
            joinDate: new Date(),
            address: '',
            citizenId: this.buildDefaultCitizenId('STAFF', userId),
          },
        });
        return;

      case RoleCode.VET:
        await tx.vetProfile.create({
          data: {
            userId,
            bio: '',
            licenseNo: this.buildDefaultVetLicenseNo(userId),
            licenseIssueBy: 'N/A',
            licenseValidFrom: new Date(),
            licenseValidTo: new Date(),
            joinDate: new Date(),
            address: '',
            citizenId: this.buildDefaultCitizenId('VET', userId),
            employmentStatus: 'WORKING',
          },
        });
        return;

      default:
        return;
    }
  }
}
