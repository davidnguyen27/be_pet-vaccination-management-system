import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { MeResponse } from '../../presentation/http/dto/auth.dto';

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort) {}

  async execute(userId: string): Promise<MeResponse> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      dob: user.dob?.toISOString() ?? null,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString() ?? null,
    };
  }
}
