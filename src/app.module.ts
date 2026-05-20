import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import appConfig from '@/configs/app.config';
import dbConfig from '@/configs/db.config';
import jwtConfig from '@/configs/jwt.config';
import emailConfig from '@/configs/email.config';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { JwtAuthGuard } from '@/shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/presentation/guards/roles.guard';
import { TransformInterceptor } from '@/shared/presentation/interceptors/transform.interceptor';
import { UserModule } from '@/modules/user/user.module';
import { PetModule } from '@/modules/pet/pet.module';
import { OwnerModule } from '@/modules/owner/owner.module';
import { StaffModule } from './modules/staff/staff.module';
import { VetModule } from './modules/vet/vet.module';
import { SpeciesModule } from './modules/species/species.module';
import { VaccineModule } from './modules/vaccine/vaccine.module';
import { VaccineLotModule } from './modules/vaccine-lot/vaccine-lot.module';

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
    VetModule,
    SpeciesModule,
    PetModule,
    VaccineModule,
    VaccineLotModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
