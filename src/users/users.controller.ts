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
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get('me')
  getMe(@CurrentUser() user: { userId: number }) {
    const queryDto: QueryUserDto = { id: user.userId };
    return this.usersService.findSpecific(queryDto);
  }

  @Get('me/auctions')
  async getUserAuctions(@CurrentUser() user: { userId: number }) {
    try {
      return this.usersService.getUserAuctions(user.userId);
    } catch (error) {
      console.log(error);
    }
  }

  @IsPublic()
  @Get('find')
  findOne(@Query() queryUserDto: QueryUserDto) {
    if (!queryUserDto.email && !queryUserDto.id && !queryUserDto.username) {
      throw new BadRequestException(
        'At least one of id, email, or username must be provided',
      );
    }

    return this.usersService.findSpecific(queryUserDto);
  }

  @Patch('profile')
  update(@CurrentUser() user: { userId: number }, @Body() updateUserDto: UpdateUserDto) {
    if (!user) {
      throw new BadRequestException('Couldnt find the user');
    }
    

    return this.usersService.updateUser(user.userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user : {userId: number},
  ) {
    return this.usersService.updatePassword(updatePasswordDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Provide an id to update user');
    }

    return this.usersService.remove(+id);
  }
}
