import { Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'generated/prisma';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { RegistrationInterceptor } from './interceptors/registration.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request & { user: User }) {
    return this.authService.login({
      email: req.user.email,
      id: req.user.id,
    });
  }

  @UseInterceptors(RegistrationInterceptor)
  @IsPublic()
  @Post('register')
  register(@Req() req: Request & { user: User }) {
    try {
      return this.authService.login({
      email: req.user.email,
      id: req.user.id,
    });
    } catch (error) {
      console.log(error);
      
    }
  }
}
