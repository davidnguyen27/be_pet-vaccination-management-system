import { API_PREFIX } from '@/constants/api-prefix';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Pet Vaccination Management System')
    .setDescription('API documentation for Pet Vaccination Management System')
    .setVersion('1.0')
    .addServer(`/${API_PREFIX}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });

  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
