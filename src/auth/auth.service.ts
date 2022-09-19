import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(data: LoginDto): Promise<User | null> {
    const passwordHash = bcrypt.hashSync(data.password, 10);
    const user = await this.userService.findOne({
      username: data.username,
    });

    if (user && user.passwordHash === passwordHash) {
      return user;
    }

    return null;
  }
}
