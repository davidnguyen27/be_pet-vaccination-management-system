import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';
import { setupSwagger } from '@/configs/swagger.config';
import { API_PREFIX } from '@/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;

  // Global prefix
  app.setGlobalPrefix(API_PREFIX);

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') ?? '*',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: errors => {
        const formattedErrors: Record<string, string> = {};

        errors.forEach(err => {
          const messages = Object.values(err.constraints ?? {}).join(', ');
          formattedErrors[err.property] = messages;
        });

        return new BadRequestException({
          errors: formattedErrors,
        });
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  setupSwagger(app);

  await app.listen(port);
  console.log(`[...] Server running on http://localhost:${port}/api/v1`);
  console.log(`>>>>> Swagger docs at http://localhost:${port}/api/v1/docs`);
}

void bootstrap();
