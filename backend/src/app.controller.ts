import { Controller, Get, Post, UseGuards, Body, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { request } from 'http';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserParam } from './auth/jwt.strategy';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Public } from './auth/public.dec';
import { User } from './user/user.decorator';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UserDto } from './users/dto/user.dto';
import { User as UserEntity } from './users/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/register')
  @Public()
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiBody({
    type: LoginUserDto,
  })
  async login(
    @User() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(user);
    res
      .cookie('token', result.access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .send(result);
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@User() user: UserParam) {
    return this.userService.findOne(user.email);
  }
}
