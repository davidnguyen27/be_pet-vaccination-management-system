import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { VetModel } from '../../application/model/vet.model';
import { VetQueryPort } from '../../application/ports/vet.query.port';
import { FindVetOptions, PaginatedResult } from '../../application/ports/vet.repository.port';
import { VetNotFoundError } from '../../domain/exceptions/vet.error';
import { Prisma } from '../../../../../generated/prisma/client';
import { Injectable } from '@nestjs/common';

type VetWithUserRaw = Prisma.VetProfileGetPayload<{ include: { user: { include: { role: true } } } }>;

@Injectable()
export class VetQueryImp implements VetQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<VetModel> {
    const raw = await this.prisma.vetProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!raw || raw.user.isDeleted) {
      throw new VetNotFoundError(userId);
    }

    return this.toModel(raw);
  }

  async findMany(options: FindVetOptions): Promise<PaginatedResult<VetModel>> {
    const { page, limit, search } = options;
    const normalizedSearch = search?.trim();

    const where: Prisma.VetProfileWhereInput = {
      user: { isDeleted: false },
      ...(normalizedSearch && {
        OR: [
          { address: { contains: normalizedSearch, mode: 'insensitive' } },
          { user: { email: { contains: normalizedSearch, mode: 'insensitive' } } },
          { user: { fullName: { contains: normalizedSearch, mode: 'insensitive' } } },
          { user: { phoneNumber: { contains: normalizedSearch, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vetProfile.findMany({
        where,
        include: {
          user: {
            include: { role: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vetProfile.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: VetWithUserRaw): VetModel {
    return {
      id: raw.id,
      user: {
        id: raw.user.id,
        role: raw.user.role.name,
        email: raw.user.email,
        fullName: raw.user.fullName,
        phoneNumber: raw.user.phoneNumber,
        avatarUrl: raw.user.avatarUrl,
        dob: raw.user.dob,
        isActive: raw.user.isActive,
        isDeleted: raw.user.isDeleted,
      },
      bio: raw.bio,
      licenseNo: raw.licenseNo,
      licenseIssueBy: raw.licenseIssueBy,
      licenseValidFrom: raw.licenseValidFrom,
      licenseValidTo: raw.licenseValidTo,
      joinDate: raw.joinDate,
      endDate: raw.endDate,
      address: raw.address,
      citizenId: raw.citizenId,
      employmentStatus: raw.employmentStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
