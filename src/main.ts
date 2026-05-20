import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@/shared/presentation/filters/http-exception.filter';
import { setupSwagger } from '@/configs/swagger.config';
import { API_PREFIX } from '@/constants/api-prefix';
import { TransformInterceptor } from './shared/presentation/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;

  // Cookies
  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix(API_PREFIX);

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  setupSwagger(app);

  await app.listen(port);
  console.log(`[...] Server running on http://localhost:${port}/api/v1`);
  console.log(`>>>>> Swagger docs at http://localhost:${port}/api/v1/docs`);
}

void bootstrap();
