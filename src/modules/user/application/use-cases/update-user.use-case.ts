import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { UserDeletedError } from '../../domain/exceptions/user.error';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';

interface UpdateUserCommand {
  id: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dob?: Date | null;
  avatar?: Express.Multer.File;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    const user = await this.userRepo.findByIdOrThrow(command.id);
    if (user.isDeleted) throw new UserDeletedError(command.id);

    const uploadedAvatar = command.avatar
      ? await this.cloudinaryService.upload(command.avatar, {
          folder: 'pet-vaccination/users/avatars',
        })
      : null;

    try {
      user.updateProfile({
        fullName: command.fullName,
        phoneNumber: command.phoneNumber,
        avatarUrl: uploadedAvatar?.secure_url ?? command.avatarUrl,
        dob: command.dob,
      });

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
