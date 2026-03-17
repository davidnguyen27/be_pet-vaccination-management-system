import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import {
  CreateUserData,
  UpdateUserData,
  GetUsersFilter,
  IUserRepository,
  PaginatedResult,
} from '../domain/i-user.repository';
import { UserEntity } from '../domain/user.entity';
import { UserMapper } from './user.mapper';
import { Prisma } from '../../../../generated/prisma/client';
import { RoleCode } from '@/enums';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { userId: id },
      include: { role: true },
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
        include: { role: true },
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
          roleId: role.roleId,
          isActive: data.isActive ?? true,
        },
      });

      await this.createRoleProfile(tx, user.userId, data);

      return tx.user.findUniqueOrThrow({
        where: { userId: user.userId },
        include: { role: true },
      });
    });

    return UserMapper.toDomain(raw);
  }

  async update(data: UpdateUserData): Promise<UserEntity> {
    const role = data.roleCode ? await this.prisma.role.findUniqueOrThrow({ where: { code: data.roleCode } }) : null;

    const raw = await this.prisma.user.update({
      where: { userId: data.id },
      data: {
        email: data.email,
        ...(data.passwordHash && { password: data.passwordHash }),
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
        dob: data.dob,
        ...(role && { roleId: role.roleId }),
      },
      include: { role: true },
    });

    return UserMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId: id },
      data: { isDeleted: true },
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

  private async createRoleProfile(tx: Prisma.TransactionClient, userId: string, data: CreateUserData): Promise<void> {
    switch (data.roleCode) {
      case RoleCode.OWN:
        await tx.ownerProfile.create({ data: { userId } });
        return;

      case RoleCode.STAFF:
        if (!data.staffProfile) {
          throw new BadRequestException('staffProfile is required when roleCode is STAFF');
        }

        await tx.staffProfile.create({
          data: {
            userId,
            code: data.staffProfile.code,
            jobTitle: data.staffProfile.jobTitle,
            department: data.staffProfile.department,
            employmentType: data.staffProfile.employmentType,
            employmentStatus: data.staffProfile.employmentStatus,
            joinDate: data.staffProfile.joinDate,
            endDate: data.staffProfile.endDate,
            address: data.staffProfile.address,
            citizenId: data.staffProfile.citizenId,
            notes: data.staffProfile.notes,
          },
        });
        return;

      default:
        return;
    }
  }
}
