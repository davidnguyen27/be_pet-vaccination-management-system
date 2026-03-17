import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { I_AUTH_REPOSITORY } from '../domain/i-auth.repository';
import { I_EMAIL_SERVICE } from '../application/ports/i-email.service';
import {
  VerifyOtpUseCase,
  RegisterUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  LogoutUseCase,
  ResendTokenUseCase,
} from '../application/use-cases';

import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { NodemailerService } from '../infrastructure/services/nodemailer.service';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/user/presentation/user.module';

const USE_CASES = [
  RegisterUseCase,
  VerifyOtpUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  LogoutUseCase,
  ResendTokenUseCase,
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
    { provide: I_AUTH_REPOSITORY, useClass: AuthRepository },
    { provide: I_EMAIL_SERVICE, useClass: NodemailerService },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
