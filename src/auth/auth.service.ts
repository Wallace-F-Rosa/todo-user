import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDto): Promise<User | null> {
    const user = await this.userService.findOne({
      username: data.username,
    });

    if (user && bcrypt.compare(data.password, user.passwordHash)) {
      return user;
    }

    return null;
  }

  async getAuthToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
