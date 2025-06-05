import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('find')
  findOne(
    @Query('id') id?: number,
    @Query('email') email?: string,
    @Query('username') username?: string,
  ) {

    if (!id && !email && !username) {
      throw new BadRequestException(
        'At least one of id, email, or username must be provided',
      );
    }

    return this.usersService.findSpecific(id ? +id : undefined, email, username);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    if (!email) {
      throw new BadRequestException('Provide an email to update user');
    }

    return this.usersService.updateUser(email, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Provide an id to update user');
    }

    return this.usersService.remove(+id);
  }
}
