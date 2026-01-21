import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UserRole } from 'src/common/enums/user.enum';

export class RegisterDto {
  @ApiProperty({ example: '+2348012345678' })
  @IsNotEmpty()
  @IsPhoneNumber(undefined)
  phone: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'jane@example.com' })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  // allow client to request a role; server will enforce defaults/validation
  @ApiPropertyOptional({ description: 'User role', enum: UserRole })
  @IsString()
  role: Role;
}
