import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ActiveUser } from '../common/decorator/active-user.decorator';
import { Public } from '../common/decorator/public-decorator';
import { ActiveUserInterface } from '../common/interface/active-user.interface';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendConfirmationMailDto } from './dto/send-confirmation-mail';
import { ActiveUserResponseDto } from './dto/active-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Registro de un nuevo usuario' })
  @ApiCreatedResponse({ description: 'Registration Successful' })
  @ApiBadRequestResponse({ description: 'Invalid birthdate format or email is already existent or password is neccesary for local registration' })
  @ApiInternalServerErrorResponse({ description: 'Error user register or creating user' })
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login de un usuario existente' })
  @ApiCreatedResponse({
    description: 'Successful login',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials or secret key not found', })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Error user login or getting unique user profile name',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener usuario activo (obtenido desde el token)' })
  @ApiOkResponse({ description: 'User found', type: ActiveUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request' })
  @ApiBearerAuth('access-token')
  getActiveUser(@ActiveUser() { id }: ActiveUserInterface) {
    return this.authService.getActiveUser(id);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Cambio de contraseña' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized request' })
  @ApiCreatedResponse({ description: 'Password changed successfully' })
  @ApiInternalServerErrorResponse({ description: 'Error changing password' })
  @ApiBearerAuth('access-token')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  changePassword(@ActiveUser() { id }: ActiveUserInterface, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Olvidaste la contraseña?' })
  @ApiCreatedResponse({ description: 'Reset password email sent successfully' })
  @ApiBadRequestResponse({ description: 'Invalid email' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error sending reset password email' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reestablecimiento de contraseña' })
  @ApiCreatedResponse({ description: 'Password reset successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid reset token or password do not match' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error resetting password' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('send-confirmation-mail')
  @Public()
  @ApiOperation({ summary: 'Enviar correo de confirmación' })
  @ApiCreatedResponse({ description: 'Confirmation email sent successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error sending confirmation email or secret key not found' })
  sendConfirmationMail(@Body() dto: SendConfirmationMailDto) {
    return this.authService.sendConfirmationMail(dto);
  }

  @Get('confirm')
  @Public()
  @ApiOperation({ summary: 'Confirmar correo' })
  @ApiCreatedResponse({ description: 'Email confirmed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error confirming email or secret key not found' })
  confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }
}
