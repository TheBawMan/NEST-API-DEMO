import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, NotFoundException, Query, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService,) { }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto, @Param('token') token: string) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.createUser(createUserDto, hashedPassword);

    await this.userService.sendVerificationEmail(user);

    return { message: 'User registered successfully. Check your email for verification.', user };
  }

  @Get('verify/:token')
  // @Redirect('/contacts')
  async verifyUser(@Param('token') token: string) {
    try {
      const userId = await this.userService.verifyTokenAndGetUserId(token);
      const userToUpdate = await this.userService.findUserById(userId);

      if (!userToUpdate) {
        throw new NotFoundException('User not found.');
      }
      userToUpdate.isVerified = true;

      await this.userService.saveUser(userToUpdate);
      return { message: 'User Verified Successfully', token, userToUpdate,  };
    } catch (error) {
      throw new NotFoundException('Invalid verification link.');
    }
  }


  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userService.findUserByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }










  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
