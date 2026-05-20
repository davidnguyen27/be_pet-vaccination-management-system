import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { RoleCode } from '@/enums';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { EMAIL_SERVICE_PORT, EmailServicePort } from '../ports/email.service.port';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { API_PREFIX } from '@/constants/api-prefix';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/modules/user/domain/user.entity';
import { randomUUID } from 'crypto';

export interface RegisterCommand {
  email: string;
  password: string;
  fullName?: string;
}

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
    @Inject(EMAIL_SERVICE_PORT) private readonly emailService: EmailServicePort,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: RegisterCommand): Promise<void> {
    const existing = await this.userRepo.findByEmail(command.email);
    if (existing && existing.isActive) {
      throw new ConflictException('Email has already been registered');
    }

    if (existing?.isDeleted) {
      throw new ConflictException('This account has been deleted and cannot be re-registered');
    }

    if (existing && existing.roleCode !== (RoleCode.OWN as string)) {
      throw new ConflictException('Email already belongs to a non-owner account');
    }

    const passwordHash = await bcrypt.hash(command.password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    this.logger.debug(`Register with: `, existing);

    if (existing) {
      await this.authRepo.changePassword(existing.id, passwordHash);
    }

    const user =
      existing ??
      UserEntity.create(randomUUID(), {
        roleCode: RoleCode.OWN,
        email: command.email,
        password: command.password,
        fullName: command.fullName ?? null,
      });

    if (!existing) {
      const hashedPassword = await user.password.hash();
      user.updatePassword(hashedPassword);
      await this.userRepo.save(user);
    }

    await this.authRepo.invalidatePreviousVerifyTokens(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.VERIFY_LINK_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createVerifyToken({
      userId: user.id,
      tokenHash,
      expiresAt,
      redirectUrl: AUTH_CONSTANTS.TOKEN_PURPOSE.VERIFY_EMAIL,
    });

    const backendBaseUrl = (this.configService.get<string>('app.publicUrl') ?? 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
    const prefixPath = API_PREFIX.replace(/^\/+/, '');
    const verifyUrl = `${backendBaseUrl}/${prefixPath}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendVerificationEmail({
      to: command.email,
      verifyUrl,
      fullName: command.fullName,
    });

    this.logger.log(`Registration verification link sent to ${command.email}`);
  }
}
