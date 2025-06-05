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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findSpecific(+id);
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
