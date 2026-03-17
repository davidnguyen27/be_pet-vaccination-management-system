import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_USER_REPOSITORY, type IUserRepository } from '../../domain/i-user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(userId: string) {
    const existing = await this.userRepo.findById(userId);
    if (!existing) throw new NotFoundException('User not found');
    await this.userRepo.delete(userId);
  }
}
