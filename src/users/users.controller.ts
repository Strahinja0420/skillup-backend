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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { User } from 'generated/prisma';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) {}

  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return {
      user,
    };
  }

  @IsPublic()
  @Get('find')
  findOne(
    @Query() queryUserDto : QueryUserDto
  ) {

    if (!queryUserDto.email && !queryUserDto.id && !queryUserDto.username) {
      throw new BadRequestException(
        'At least one of id, email, or username must be provided',
      );
    }

    return this.usersService.findSpecific(queryUserDto);
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
