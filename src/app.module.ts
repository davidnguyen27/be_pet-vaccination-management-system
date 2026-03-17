import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from '@/configs/app.config';
import dbConfig from '@/configs/db.config';
import jwtConfig from '@/configs/jwt.config';
import emailConfig from '@/configs/email.config';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/presentation/auth.module';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { TransformInterceptor } from '@/shared/interceptors/transform.interceptor';
import { UserModule } from '@/modules/user/presentation/user.module';
import { PetModule } from '@/modules/pet/presentation/pet.module';
import { OwnerModule } from '@/modules/owner/presentation/owner.module';
import { StaffModule } from './modules/staff/presentation/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      load: [appConfig, dbConfig, jwtConfig, emailConfig],
      expandVariables: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    PrismaModule,
    AuthModule,
    UserModule,
    OwnerModule,
    StaffModule,
    PetModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
