import { Body, Controller,Request, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from 'src/dto/response.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)  
  @Get()
  view(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  add(@Body() data:UserCreateDto): Promise<ResponseDto>{
    return this.userService.add(data); 
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

}
