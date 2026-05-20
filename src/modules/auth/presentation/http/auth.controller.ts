import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public, CurrentUser, JwtPayload } from '@/shared/presentation/decorators';
import { getRequestInfo } from '@/modules/auth/helpers/request-info.helper';
import { setTokenCookies } from '@/modules/auth/helpers/token-cookies.helper';

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
} from '../../application/use-cases';

import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResendEmailDTO,
  ResetPasswordDTO,
  ValidateTokenDTO,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendEmailUseCase: ResendEmailUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user logged-in' })
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.getMeUseCase.execute(user.sub);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDTO) {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query('token') token: string) {
    return this.verifyEmailUseCase.execute(token);
  }

  @Public()
  @Post('resend-email')
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  async resendEmail(@Body() dto: ResendEmailDTO) {
    return this.resendEmailUseCase.execute(dto.email);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.loginUseCase.execute(dto, getRequestInfo(req));
    return setTokenCookies(res, tokens);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');
    const tokens = await this.refreshTokenUseCase.execute(refreshToken);
    return setTokenCookies(res, tokens);
  }

  @Public()
  @Post('forgot-password')
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send reset password link to user email' })
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    return this.forgotPasswordUseCase.execute(dto);
  }

  @Public()
  @Post('validate-token')
  @ApiOperation({ summary: 'Validate reset password token' })
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() dto: ValidateTokenDTO) {
    return this.validateTokenUseCase.execute(dto.token);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password by token from reset password email link' })
  async resetPassword(@Body() dto: ResetPasswordDTO) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    await this.logoutUseCase.execute(user.sub, user.jti);
    res.clearCookie('refresh_token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
