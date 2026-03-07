import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { I_AUTH_REPOSITORY } from '../domain/repositories/i-auth.repository';
import { I_EMAIL_SERVICE } from '../application/ports/i-email.service';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { VerifyOtpUseCase } from '../application/use-cases/verify-otp.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { ForgotPasswordUseCase } from '../application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../application/use-cases/reset-password.use-case';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { NodemailerService } from '../infrastructure/services/nodemailer.service';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { AuthController } from './auth.controller';

const USE_CASES = [
  RegisterUseCase,
  VerifyOtpUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule registered without secret here; each use-case signs with
    // explicit secret from ConfigService (supporting dual access/refresh secrets)
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    ...USE_CASES,
    JwtStrategy,
    { provide: I_AUTH_REPOSITORY, useClass: AuthRepository },
    { provide: I_EMAIL_SERVICE, useClass: NodemailerService },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
