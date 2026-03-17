import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, CurrentUser, JwtPayload } from '@/shared/decorators';
import { getRequestInfo } from '@/shared/helpers/request-info.helper';
import { setTokenCookies } from '@/shared/helpers/token-cookies.helper';

import {
  RegisterUseCase,
  VerifyOtpUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  LogoutUseCase,
  ResendTokenUseCase,
  GetMeUseCase,
} from '../application/use-cases';

import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from '../application/dtos/auth-req.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly resendTokenUseCase: ResendTokenUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get current user successfully.')
  @ApiOperation({ summary: 'Get current logged-in user' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.getMeUseCase.execute(user.sub);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Registration successful. Please check your email for the OTP.')
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('OTP resent successfully. Please check your email.')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.resendTokenUseCase.execute(dto.email);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email verified successfully.')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.verifyOtpUseCase.execute(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful.')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.loginUseCase.execute(dto, getRequestInfo(req));
    setTokenCookies(res, tokens);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Token refreshed successfully.')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');
    const tokens = await this.refreshTokenUseCase.execute(refreshToken);
    setTokenCookies(res, tokens);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('The request is sent successfully.')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto);
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
    await this.logoutUseCase.execute(user.sub);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
