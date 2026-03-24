import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { RoleCode } from '@/enums';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { I_EMAIL_SERVICE, type IEmailService } from '../ports/i-email.service';
import { RegisterDto } from '../dtos/auth-req.dto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { API_PREFIX } from '@/constants';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: RegisterDto): Promise<void> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing && existing.isActive) {
      throw new ConflictException('Email has already been registered');
    }

    if (existing?.isDeleted) {
      throw new ConflictException('This account has been deleted and cannot be re-registered');
    }

    if (existing && existing.roleCode !== (RoleCode.OWN as string)) {
      throw new ConflictException('Email already belongs to a non-owner account');
    }

    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    this.logger.debug(`Register with: `, existing);

    if (existing) {
      await this.authRepo.changePassword(existing.id, passwordHash);
      await this.userRepo.ensureOwnerProfile(existing.id);
    }

    const user =
      existing ??
      (await this.userRepo.create({
        email: dto.email,
        passwordHash,
        roleCode: RoleCode.OWN,
        isActive: false,
        fullName: dto.fullName,
      }));

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

    await this.emailService.sendVerificationLink({
      to: dto.email,
      verifyUrl,
      fullName: dto.fullName,
    });

    this.logger.log(`Registration verification link sent to ${dto.email}`);
  }
}
