import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dtos/user-req.dto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { I_USER_REPOSITORY, type IUserRepository } from '../../domain/i-user.repository';
import { UserMapper } from '../../infrastructure/user.mapper';
import { UserResponseDto } from '../dtos/user-res.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(dto: UserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (existing && !existing.isDeleted) throw new ConflictException('Email already registered');
    if (existing?.isDeleted) throw new ConflictException('This account has been deleted and cannot be re-registered');

    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    const user = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      roleCode: dto.roleCode,
      isActive: true,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      avatarUrl: dto.avatarUrl,
      dob: dto.dob,
    });

    return UserMapper.toResponse(user);
  }
}
