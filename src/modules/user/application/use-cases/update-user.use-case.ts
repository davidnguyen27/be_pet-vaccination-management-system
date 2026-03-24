import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dtos/user-req.dto';
import { I_USER_REPOSITORY, type IUserRepository } from '../../domain/i-user.repository';
import { UserMapper } from '../../infrastructure/user.mapper';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(userId: string, dto: UserDto) {
    const existing = await this.userRepo.findById(userId);
    if (!existing) throw new NotFoundException('User not found');

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS) : undefined;

    const updated = await this.userRepo.update({
      id: userId,
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      avatarUrl: dto.avatarUrl,
      dob: dto.dob,
      roleCode: dto.roleCode,
    });

    return UserMapper.toResponse(updated);
  }
}
