import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { QueryUserDto } from './dto/query-user.dto';

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
      throw new BadRequestException(
        'Something went wrong while updating a user',
      );
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
