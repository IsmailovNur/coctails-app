import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  googleId?: string;
}
