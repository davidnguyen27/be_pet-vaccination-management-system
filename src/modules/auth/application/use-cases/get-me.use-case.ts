import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_USER_REPOSITORY, IUserRepository } from '@/modules/user/domain/i-user.repository';
import { UserResponseDto } from '@/modules/user/application/dtos/user-res.dto';
import { UserMapper } from '@/modules/user/infrastructure/user.mapper';

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toResponse(user);
  }
}
