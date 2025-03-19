import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Saidkamol' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'Saidkamol@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Saidkamol.jpg' })
  @IsString()
  img: string;

  
  @ApiProperty({ example: ['USER', 'ADMIN'] })
  @IsString()
  role: Role;
}

export class LoginDto {
  @ApiProperty({ example: 'Saidkamol@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  password: string;

  @ApiProperty({ example: '1.2.1.1.0' })
  @IsString()
  IP: string;
}
