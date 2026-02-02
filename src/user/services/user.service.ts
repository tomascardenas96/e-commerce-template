import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { IUserActionResponse, IUserAuth, IUserBase, IUserProfile } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<IUserBase> {
    try {
      const exists = await this.isUserAlreadyExists(createUserDto.email);

      if (exists) {
        this.logger.warn(`[USER_CREATE_CONFLICT] - Email already exists: ${createUserDto.email}`);
        throw new BadRequestException('Email is already existent');
      }

      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`[USER_CREATE_ERROR] - Error creating user: ${error}`);
      throw new InternalServerErrorException('Error creating user');
    }

  }

  private async isUserAlreadyExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  async getUserByEmail(email: string): Promise<IUserAuth> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'name', 'lastname', 'email', 'password', 'isEmailConfirmed', 'role', 'failedAttempts', 'lockedUntil', 'resetToken'],
        relations: ['role'],
        withDeleted: true
      });

      return user;
    } catch (error) {
      this.logger.error(
        `[USER_GET_BY_EMAIL_ERROR] - Email: ${email} - Error: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Error retrieving user data');
    }

  }

  async getUserById(id: string): Promise<IUserAuth> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        withDeleted: true,
        select: [
          'id',
          'name',
          'lastname',
          'email',
          'birthdate',
          'password',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'isEmailConfirmed',
          'role',
          'failedAttempts',
          'lockedUntil',
          'resetToken'
        ]
      });

      if (!user) {
        this.logger.warn(`[USER_NOT_FOUND] - ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `[USER_GET_BY_ID_ERROR] - Id: ${id} - Error: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Error retrieving user data by id');
    }
  }

  async updateUserInformation(id: string, updateUserDto: UpdateUserDto): Promise<IUserActionResponse> {
    try {
      const parsedDate = new Date(updateUserDto.birthdate + "T00:00:00");
      const isValidDate = !isNaN(parsedDate.getTime())

      if (updateUserDto.birthdate && !isValidDate) {
        this.logger.warn(`[USER_UPDATE_BAD_DATE] - ID: ${id} - Provided Date: ${updateUserDto.birthdate}`);
        throw new BadRequestException("Invalid date format")
      }

      const user = await this.userRepository.preload({
        id,
        ...updateUserDto,
        birthdate: updateUserDto.birthdate ? parsedDate : undefined
      });

      if (!user) {
        this.logger.warn(`[USER_UPDATE_NOT_FOUND] - Attempted to update non-existent user: ${id}`);
        throw new NotFoundException('User not found');
      }

      await this.userRepository.save(user);

      const updatedFields = Object.keys(updateUserDto).join(', ');
      this.logger.log(`[USER_UPDATE_SUCCESS] - ID: ${id} - Fields updated: ${updatedFields}`);

      return {
        success: true,
        message: `User with ID ${id} was successfully updated`,
        userId: id
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[USER_UPDATE_CRITICAL_ERROR] - ID: ${id} - Error: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException("Error updating user information");
    }
  }

  async getUserByIdWithoutPassword(id: string): Promise<IUserProfile> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        withDeleted: true,
        select: {
          id: true,
          name: true,
          lastname: true,
          email: true,
          birthdate: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          role: {
            id: true,
            name: true
          },
          isEmailConfirmed: true,
        },
        relations: ['role']
      });

      if (!user) {
        this.logger.warn(`[USER_NOT_FOUND] - ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `[USER_GET_BY_ID_ERROR] - ID: ${id} - Message: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Error retrieving user profile');
    }

  }

  async softDeleteUser(id: string): Promise<IUserActionResponse> {
    try {
      const deleteUser = await this.userRepository.softDelete(id);

      if (deleteUser.affected === 0) {
        this.logger.warn(`[USER_DELETE_NOT_FOUND] - Attempted to delete non-existent ID: ${id}`);
        throw new NotFoundException('User not found')
      }

      return {
        success: true,
        message: `User with ID ${id} was successfully deactivated`,
        userId: id
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[USER_SOFT_DELETE_CRITICAL_ERROR] - ID: ${id} - Error: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException("Error soft deleting user")
    }
  }

  async restoreDeletedUser(id: string): Promise<IUserActionResponse> {
    try {
      const restoredUser = await this.userRepository.restore(id);

      if (restoredUser.affected === 0) {
        this.logger.warn(`[USER_RESTORE_FAILED] - ID: ${id} - Reason: User not found or not deleted`);
        throw new NotFoundException('User not found or not in a deleted state');
      }

      this.logger.log(`[USER_RESTORE_SUCCESS] - User ID: ${id} has been successfully reactivated`);

      return {
        success: true,
        message: 'User has been successfully reactivated',
        userId: id
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[USER_RESTORE_CRITICAL_ERROR] - ID: ${id} - Error: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException("Error restoring deleted user")
    }
  }

  async update(id: string, user: User): Promise<IUserBase> {
    try {
      const userToBeUpdated = await this.userRepository.preload({
        id,
        ...user,
      });

      if (!userToBeUpdated) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.userRepository.save(userToBeUpdated);
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[USER_UPDATE_CRITICAL_ERROR] - ID: ${id} - Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async markUserAsConfirmed(user: User): Promise<IUserBase> {
    try {
      if (user.isEmailConfirmed) {
        this.logger.warn(`[USER_CONFIRM_ALREADY_DONE] - User: ${user.email}`);
        throw new BadRequestException('User already confirmed');
      }

      user.isEmailConfirmed = true;
      const updatedUser = await this.userRepository.save(user);

      this.logger.log(`[USER_CONFIRM_SUCCESS] - Email: ${user.email} - ID: ${user.id}`);
      return updatedUser;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[USER_CONFIRM_CRITICAL_ERROR] - ID: ${user.id} - Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error confirming user email');
    }
  }
}
