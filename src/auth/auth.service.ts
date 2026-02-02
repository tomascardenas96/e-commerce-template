import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserAuth, IUserBase, IUserProfile } from 'src/user/interfaces/user.interface';
import { TooManyRequestsException } from '../common/exceptions/too-many-request.exception';
import { MailService } from '../mail/mail.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendConfirmationMailDto } from './dto/send-confirmation-mail';
import { RoleService } from 'src/role/services/role.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  private MAX_FAILED_ATTEMPTS = 4;
  private LOCK_TIME_MINUTES = 5;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly roleService: RoleService
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(registerDto.password, salt);
      const birthdate = new Date(registerDto.birthdate + 'T00:00:00');

      if (isNaN(birthdate.getTime())) {
        this.logger.warn(`[REGISTER_BAD_REQUEST] - Invalid birthdate: ${registerDto.birthdate} - Email: ${registerDto.email}`);
        throw new BadRequestException('Invalid birthdate format');
      }

      const role = await this.roleService.getRoleByName('member');

      const userToCreate = {
        ...registerDto,
        birthdate,
        password: hashedPassword,
        role: role.id,
      };

      const createdUser = await this.userService.create(userToCreate) as IUserBase;

      // Log de éxito en DB
      this.logger.log(`[REGISTER_SUCCESS] - User Created ID: ${createdUser.id} - Email: ${createdUser.email}`);

      this.sendConfirmationMail({ email: createdUser.email })
        .catch(err =>
          this.logger.error(`[MAIL_ERROR] - Could not send confirmation to ${createdUser.email}`, err.stack)
        );

      return {
        message: 'Registration Successful',
      };
    } catch (error) {
      const details = `Email: ${registerDto.email} - Message: ${error.message}`;

      if (error instanceof HttpException) {
        this.logger.warn(`[REGISTER_HTTP_EXCEPTION] - Status: ${error.getStatus()} - ${details}`);
        throw error;
      }

      this.logger.error(`[REGISTER_UNKNOWN_ERROR] - ${details}`, error.stack);
      throw new InternalServerErrorException('Error user register');
    }

  }

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;

    try {
      // 1. Buscar usuario
      const user: IUserAuth = await this.userService.getUserByEmail(email);

      // 2. Si no existe, usamos una respuesta genérica (Seguridad)
      if (!user) {
        this.logger.warn(`[LOGIN_FAILED] - Email not found: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // 3. Verificar si está bloqueado
      if (user.lockedUntil) {
        if (new Date() < user.lockedUntil) {
          const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);

          this.logger.warn(`[LOGIN_LOCKED] - User ID: ${user.id} - Email: ${email} - Remaining: ${remainingTime} min`);

          throw new TooManyRequestsException(`Account blocked. Try again in ${remainingTime} minutes.`);
        } else {
          user.lockedUntil = null;
          user.failedAttempts = 0;
          await this.userService.update(user.id, user as User);
        }
      }

      // 4. Validar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        user.failedAttempts++;

        if (user.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
          this.logger.error(`[LOGIN_LOCK_ACTIVATED] - User: ${email} - Reason: Max attempts reached`);
          user.lockedUntil = new Date(Date.now() + this.LOCK_TIME_MINUTES * 60 * 1000);
        } else {
          this.logger.warn(`[LOGIN_FAILED] - Invalid password for: ${email} - Attempt: ${user.failedAttempts}`);
        }

        await this.userService.update(user.id, user as User);
        throw new UnauthorizedException('Invalid credentials');
      }

      // 5. Éxito: Resetear contador
      // Solo actualizamos si había intentos fallidos previos para ahorrar una escritura en DB
      if (user.failedAttempts > 0) {
        user.failedAttempts = 0;
        user.lockedUntil = null;
        await this.userService.update(user.id, user as User);
      }

      // 6. Generar Token y enviarlo en cookie
      const payload = { sub: user.id, role: user.role.name };

      const SECRET_KEY = process.env.SECRET_KEY;

      if (!SECRET_KEY) {
        this.logger.error(`[CRITICAL_CONFIG] - Secret key not found in environment`);
        throw new InternalServerErrorException('Secret key not found');
      }

      const token = await this.jwtService.signAsync(payload, {
        secret: SECRET_KEY,
        expiresIn: '14d'
      });

      response.cookie('access_token', token, {
        httpOnly: true,               // Impide acceso desde JavaScript (Anti-XSS)
        secure: process.env.NODE_ENV === 'production', // Solo viaja por HTTPS en producción
        sameSite: 'lax',              // Protege contra CSRF
        maxAge: 14 * 24 * 60 * 60 * 1000 // 14 días en milisegundos
      })

      this.logger.log(`[LOGIN_SUCCESS] - User ID: ${user.id} - Role: ${user.role.name}`);

      return {
        user: {
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          birthdate: user.birthdate,
          isEmailConfirmed: user.isEmailConfirmed,
          role: {
            id: user.role.id,
            name: user.role.name,
          },

        },
        message: 'Login successful'
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`[LOGIN_UNKNOWN_ERROR] - Email: ${email} - Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error during login process');
    }
  }

  async getActiveUser(id: string) {
    try {
      const user: IUserProfile = await this.userService.getUserByIdWithoutPassword(id);

      if (!user) {
        this.logger.warn(`[GET_ACTIVE_USER_NOT_FOUND] - User ID: ${id}`);
        throw new NotFoundException('User not found')
      };

      return {
        user,
        message: "User successfully retrieved"
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[GET_ACTIVE_USER_ERROR] - Error fetching data for User ID: ${id} - ${error.message}`,
        error.stack
      );

      throw new InternalServerErrorException('Could not retrieve user profile statistics');
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

    try {
      const user: IUserAuth = await this.userService.getUserById(id);

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        this.logger.warn(`[CHANGE_PASSWORD_FAILED] - Invalid old password - User ID: ${id}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      if (newPassword !== confirmPassword) {
        this.logger.warn(`[CHANGE_PASSWORD_MISMATCH] - New passwords do not match - User ID: ${id}`);
        throw new UnauthorizedException('Passwords do not match');
      }

      user.password = hashedPassword;

      await this.userService.update(user.id, user as User);

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[CHANGE_PASSWORD_ERROR] - Critical failure for User ID: ${id} - ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Error updating password');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user: IUserAuth = await this.userService.getUserByEmail(dto.email);

      if (!user) {
        this.logger.warn(`[FORGOT_PASSWORD_ATTEMPT] - Email not found: ${dto.email}`);
        return {
          message: 'If the email is registered, you will receive a reset link shortly.',
        };
      }

      const payload = { sub: user.id, role: user.role };

      const resetToken = await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '15m'
      });

      user.resetToken = resetToken;
      await this.userService.update(user.id, user as User);

      await this.mailService.sendResetPasswordMail(user.email, resetToken);

      this.logger.log(`[FORGOT_PASSWORD_SENT] - Email: ${user.email} - User ID: ${user.id}`);

    } catch (error) {
      this.logger.error(
        `[FORGOT_PASSWORD_ERROR] - Email: ${dto.email} - Error: ${error.message}`,
        error.stack
      );

      throw new InternalServerErrorException('Error processing request');
    }

    return {
      message: 'If the email is registered, you will receive a reset link shortly.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = dto;

    try {
      if (newPassword !== confirmPassword) {
        this.logger.warn(`[RESET_PASSWORD_MISMATCH] - Passwords do not match for provided token`);
        throw new UnauthorizedException('Passwords do not match');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      if (!SECRET_KEY) {
        this.logger.error(`[CRITICAL_CONFIG] - Secret key not found in resetPassword`);
        throw new UnauthorizedException('Secret key not found');
      };

      let payload: any;

      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: SECRET_KEY,
        });
      } catch (error) {
        this.logger.warn(`[RESET_PASSWORD_TOKEN_INVALID] - Reason: ${error.message}`);
        throw new UnauthorizedException('Token expired or invalid');
      }

      const user: IUserAuth = await this.userService.getUserById(payload.sub);

      if (!user || user.resetToken !== token) {
        this.logger.warn(`[RESET_PASSWORD_TOKEN_MISMATCH] - User ID: ${payload?.sub} - Token might be reused or replaced`);
        throw new UnauthorizedException('Token already used or invalid');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.resetToken = null;

      await this.userService.update(user.id, user as User);

      this.logger.log(`[RESET_PASSWORD_SUCCESS] - Password reset completed for User ID: ${user.id}`);

      return { message: 'Password reset successfully' };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`[RESET_PASSWORD_ERROR] - Unexpected failure: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error resetting password');
    }
  }

  async sendConfirmationMail(dto: SendConfirmationMailDto) {
    try {
      const user: IUserAuth = await this.userService.getUserByEmail(dto.email);

      if (!user) {
        this.logger.warn(`[CONFIRMATION_MAIL_ATTEMPT] - User not found: ${dto.email}`);
        throw new NotFoundException('User not found');
      }

      const SECRET_KEY: string = process.env.SECRET_KEY;
      if (!SECRET_KEY) {
        this.logger.error(`[CRITICAL_CONFIG] - Secret key missing in sendConfirmationMail`);
        throw new Error('Secret key not found');
      }

      const confirmationToken: string = await this.jwtService.signAsync(
        { sub: user.id, role: user.role },
        { expiresIn: '1h', secret: SECRET_KEY },
      );

      await this.mailService.sendConfirmationMail(
        user.email,
        confirmationToken,
      );

      this.logger.log(`[CONFIRMATION_MAIL_SENT] - User ID: ${user.id} - Email: ${user.email}`);

      return {
        message: 'Confirmation mail sent successfully',
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[CONFIRMATION_MAIL_ERROR] - Email: ${dto.email} - Error: ${error.message}`,
        error.stack
      );

      throw new InternalServerErrorException('Error sending confirmation email');
    }
  }

  async confirmEmail(token: string) {
    try {
      const SECRET_KEY = process.env.SECRET_KEY;

      if (!SECRET_KEY) {
        this.logger.error(`[CRITICAL_CONFIG] - Secret key not found in confirmEmail`);
        throw new Error('Secret key not found');
      }

      let payload: any;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: SECRET_KEY,
        });
      } catch (error) {
        this.logger.warn(`[EMAIL_CONFIRM_FAILED] - Invalid or expired token - Error: ${error.message}`);
        throw new BadRequestException('Token expired or invalid');
      }

      const user: IUserAuth = await this.userService.getUserById(payload.sub);

      if (!user) {
        this.logger.warn(`[EMAIL_CONFIRM_USER_NOT_FOUND] - User ID from token: ${payload.sub}`);
        throw new UnauthorizedException('Invalid token');
      }

      if (user.isEmailConfirmed) {
        this.logger.log(`[EMAIL_ALREADY_CONFIRMED] - User: ${user.email}`);
        return { message: 'Email was already confirmed' };
      }

      await this.userService.markUserAsConfirmed(user as User);

      this.logger.log(`[EMAIL_CONFIRMED_SUCCESS] - User ID: ${user.id} - Email: ${user.email}`);

      return {
        message: 'Email confirmed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMAIL_CONFIRM_CRITICAL_ERROR] - Token: ${token.substring(0, 10)}... - Error: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Error confirming email');
    }
  }
}
