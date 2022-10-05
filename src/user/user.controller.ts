import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll({});
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req) {
    return this.userService.findOne({ id: req.user.id });
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.id, data);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }
}
