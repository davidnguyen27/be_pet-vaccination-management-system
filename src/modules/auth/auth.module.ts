import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AUTH_REPOSITORY_PORT } from './application/ports/auth.repository.port';
import { EMAIL_SERVICE_PORT } from './application/ports/email.service.port';
import {
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  ValidateTokenUseCase,
  LogoutUseCase,
  ResendEmailUseCase,
  GetMeUseCase,
  VerifyEmailUseCase,
} from './application/use-cases';

import { AuthRepositoryImpl } from './infrastructure/persistence/auth.repository.imp';
import { MailServiceImpl } from './infrastructure/mail/mail.service.imp';
import { JwtStrategy } from './presentation/http/strategies/jwt.strategy';
import { AuthController } from './presentation/http/auth.controller';
import { UserModule } from '@/modules/user/user.module';

const USE_CASES = [
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  ValidateTokenUseCase,
  LogoutUseCase,
  VerifyEmailUseCase,
  ResendEmailUseCase,
  GetMeUseCase,
];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule registered without secret here; each use-case signs with
    // explicit secret from ConfigService (supporting dual access/refresh secrets)
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    ...USE_CASES,
    JwtStrategy,
    { provide: AUTH_REPOSITORY_PORT, useClass: AuthRepositoryImpl },
    { provide: EMAIL_SERVICE_PORT, useClass: MailServiceImpl },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
