import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema.js';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register.user.dto.js';
import { LoginUserDto } from './login.user.dto.js';
import { AuthGuard } from '../middlewares/auth.guard.js';
import type { RequestWithUser } from '../types.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'node:crypto';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/images/users',
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname);

          callback(null, `${randomUUID()}${extension}`);
        },
      }),
    }),
  )
  async register(
    @UploadedFile()
    uploadedFile: Express.Multer.File,

    @Body()
    userDto: RegisterUserDto,
  ) {
    const username = userDto?.username?.trim();
    const displayName = userDto?.displayName?.trim();
    const email = userDto?.email?.trim().toLowerCase();
    const password = userDto?.password?.trim();
    const googleId = userDto?.googleId?.trim();

    if (!uploadedFile) {
      throw new BadRequestException('Avatar is required!');
    }

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email is already taken!');
    }

    const user = new this.userModel({
      username,
      displayName,
      email,
      avatar: `images/users/${uploadedFile.filename}`,
      password,
      role: 'user',
      googleId: googleId || null,
    });

    user.generateToken();

    try {
      return await user.save();
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === 11000) {
        throw new BadRequestException('Username or email is already taken!');
      }

      throw e;
    }
  }

  @Post('/login')
  async login(@Body() userDto: LoginUserDto) {
    const username = userDto?.username?.trim();
    const password = userDto?.password?.trim();

    const user = await this.userModel.findOne({
      username,
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password!');
    }

    const isPasswordCorrect = await user.checkPassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect username or password!');
    }

    user.generateToken();
    await user.save();
    return user;
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException('Unauthenticated!');
    }

    request.user.generateToken();
    await request.user.save();
    return {
      message: 'Logout successful!',
    };
  }
}
