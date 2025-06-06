import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.databaseService.user.create({
        data: createUserDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while creating a user',
      );
    }
  }

  async findAll() {
    return await this.databaseService.user.findMany({
      include : {
        bids : true
      }
    });
  }

  async findSpecific(queryUserDto: QueryUserDto) {
    try {
      return await this.databaseService.user.findFirst({
        where: queryUserDto,
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while finding a user',
      );
    }
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    try {
      if (!email) {
        throw new BadRequestException('Email must be provided.');
      }

      const existingUser = await this.databaseService.user.findFirst({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found with the given email.');
      }

      const updatedUser = await this.databaseService.user.update({
        where: { email: existingUser.email },
        data: updateUserDto,
      });

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Something went wrong while updating a user',
      );
    }
  }

  async updatePassword(dto: UpdatePasswordDto, userId: number) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new BadRequestException('User not found');

      const passwordMatch = await bcrypt.compare(
        dto.currentPassword,
        user.password,
      );

      if (!passwordMatch) {
        throw new BadRequestException('Current password is incorrect');
      }

      //These logs were used to fix my comparing not working

      // console.log('user.password (hashed):', user.password); 
      // console.log('dto.newPassword (plain):', dto.newPassword);

      const samePassword = await bcrypt.compare(dto.newPassword, user.password);
      // console.log('samePassword result:', samePassword);

      if (samePassword) {
        throw new BadRequestException(
          'Your new password cant be the same as your old password!',
        );
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

      await this.databaseService.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(id: number) {
    try {
      const existingUser = await this.databaseService.user.findFirst({
        where: {
          id,
        },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found with the given id.');
      }

      return await this.databaseService.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while deleting a user',
      );
    }
  }
}
