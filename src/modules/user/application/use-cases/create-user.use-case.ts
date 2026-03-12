import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I_USER_REPOSITORY, IUserRepository } from '../../domain/i-user.repository';
import { RoleCode } from '@/enums';
import { UserDto } from '../dtos/user-req.dto';
import { UserResponseDto } from '../dtos/user-res.dto';
import { UserMapper } from '../../infrastructure/user.mapper';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  async execute(dto: UserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const created = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      roleCode: dto.roleCode as RoleCode,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      avatarUrl: dto.avatarUrl,
      dob: dto.dob ?? null,
    });

    return UserMapper.toResponse(created);
  }
}
