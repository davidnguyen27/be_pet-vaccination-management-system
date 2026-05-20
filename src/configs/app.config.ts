import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  publicUrl: process.env.APP_PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? '3000'}`,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  resetPasswordPath: process.env.RESET_PASSWORD_PATH ?? '/reset-password',
}));
