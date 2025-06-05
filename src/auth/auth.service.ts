import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { QueryUserDto } from 'src/users/dto/query-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Partial<User> | null> {
    const user = await this.usersService.findSpecific({ email });
    if (user && this.dehash(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: QueryUserDto) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  hash(input : string){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(input,salt)
  }

  dehash(password: string, comparator: string){
    return bcrypt.compareSync(password, comparator)
  }
}
