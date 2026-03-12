import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<UserEntity[]> {
    const raws = await this.prisma.user.findMany({
      include: { role: true },
    });
    return raws ? raws.map(raw => UserMapper.toDomain(raw)) : [];
  }

  async findAllWithFilters(filter: GetUsersFilter): Promise<PaginatedResult<UserEntity>> {
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

  async create(data: CreateUserData): Promise<UserEntity> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { code: data.roleCode },
    });

    const raw = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
        dob: data.dob,
        roleId: role.roleId,
        isActive: true,
      },
      include: { role: true },
    });

    return UserMapper.toDomain(raw);
  }

  async update(data: UpdateUserData): Promise<UserEntity> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { code: data.roleCode },
    });

    const raw = await this.prisma.user.update({
      where: { userId: data.id },
      data: {
        email: data.email,
        ...(data.passwordHash && { password: data.passwordHash }),
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
        dob: data.dob,
        roleId: role.roleId,
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
}
