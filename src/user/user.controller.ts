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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll({});
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req) {
    return this.userService.findOne({ id: req.user.id });
  }

  @MessagePattern({ cmd: 'validateToken' })
  validateTokenPayload(@Body() payload: { id: string; username: string }) {
    const user = this.userService.findOne({
      id: payload.id,
      username: payload.username,
    });

    if (!user) {
      return null;
    }

    return user;
  }

  @ApiBearerAuth()
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  update(@Request() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.id, data);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }
}
