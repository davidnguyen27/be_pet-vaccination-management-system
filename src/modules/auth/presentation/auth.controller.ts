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
import { Public, ResponseMessage, CurrentUser, JwtPayload } from '@/shared/decorators';
import { getRequestInfo } from '@/shared/helpers/request-info.helper';
import { setTokenCookies } from '@/shared/helpers/token-cookies.helper';

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
} from '../application/use-cases';

import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendEmailDto,
  ResetPasswordDto,
  ValidateTokenDto,
} from '../application/dtos/auth-req.dto';

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
  getMe(@CurrentUser() user: JwtPayload) {
    return this.getMeUseCase.execute(user.sub);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Registration successful, please verify your email.')
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email verified successfully.')
  verifyEmail(@Query('token') token: string) {
    return this.verifyEmailUseCase.execute(token);
  }

  @Public()
  @Post('resend-email')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Verification link resent successfully.')
  resendEmail(@Body() dto: ResendEmailDto) {
    return this.resendEmailUseCase.execute(dto.email);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful.')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.loginUseCase.execute(dto, getRequestInfo(req));
    return setTokenCookies(res, tokens);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Token has been refreshed.')
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
  @ResponseMessage('The request is sent successfully.')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto);
  }

  @Public()
  @Post('validate-token')
  @ApiOperation({ summary: 'Validate reset password token' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Reset password link is valid.')
  validateToken(@Body() dto: ValidateTokenDto) {
    return this.validateTokenUseCase.execute(dto.token);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password reset successfully.')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logout successful.')
  async logout(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    await this.logoutUseCase.execute(user.sub, user.jti);
    res.clearCookie('refresh_token', {
      path: '/',
    });
  }
}
