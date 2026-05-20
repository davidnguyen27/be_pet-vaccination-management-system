import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserEmailAlreadyExistsError } from '../../domain/exceptions/user.error';
import { randomUUID } from 'crypto';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';

interface CreateUserCommand {
  email: string;
  password: string;
  roleCode: string;
  fullName: string | null;
  phoneNumber: string | null;
  dob: Date | null;
  avatar?: Express.Multer.File;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    // 1. Check email uniqueness
    const exists = await this.userRepo.existsByEmail(command.email);
    if (exists) throw new UserEmailAlreadyExistsError(command.email);

    const uploadedAvatar = command.avatar
      ? await this.cloudinaryService.upload(command.avatar, {
          folder: 'pet-vaccination/users/avatars',
        })
      : null;

    try {
      // 2. Create entity
      const user = UserEntity.create(randomUUID(), {
        ...command,
        roleCode: command.roleCode,
        avatarUrl: uploadedAvatar?.secure_url ?? null,
      });

      // 3. Hash password
      const hashedPassword = await user.password.hash();
      user.updatePassword(hashedPassword);

      // 4. Persist
      await this.userRepo.save(user);

      return user;
    } catch (error) {
      if (uploadedAvatar?.public_id) {
        await this.cloudinaryService.delete(uploadedAvatar.public_id);
      }

      throw error;
    }
  }
}
