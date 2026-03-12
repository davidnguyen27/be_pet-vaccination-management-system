import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_USER_REPOSITORY, IUserRepository } from '../../domain/i-user.repository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
