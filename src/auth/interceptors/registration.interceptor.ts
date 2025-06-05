import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'generated/prisma';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { error } from 'console';

@Injectable()
export class RegistrationInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request & { user: User } = context
      .switchToHttp()
      .getRequest();

    const createUserDto: CreateUserDto = plainToInstance(
      CreateUserDto,
      request.body,
    );

    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      const messages = errors.map((error) =>
        Object.values(error.constraints || {}).join(', '),
      );
      throw new BadRequestException(messages)
    }

    const user = await this.usersService.create({
      ...createUserDto,
      password : this.authService.hash(createUserDto.password)
    })
    request.user = user;
    return next.handle();
  }
}
