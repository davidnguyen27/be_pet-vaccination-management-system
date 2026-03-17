import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I_USER_REPOSITORY, IUserRepository } from '../../domain/i-user.repository';
import { UserDto } from '../dtos/user-req.dto';
import { UserResponseDto } from '../dtos/user-res.dto';
import { UserMapper } from '../../infrastructure/user.mapper';
import { AUTH_CONSTANTS } from '@/constants/auth';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(dto: UserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    const created = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      roleCode: dto.roleCode,
      isActive: false,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      avatarUrl: dto.avatarUrl,
      dob: dto.dob ?? null,
      staffProfile: dto.staffProfile as any,
    });

    return UserMapper.toResponse(created);
  }
}
