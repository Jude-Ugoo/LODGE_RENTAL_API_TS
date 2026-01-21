import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/common/services/email.service';
import { EmailTypes } from 'src/common/services/email-templates/auth.template';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private sanitize(user: any): UserDto {
    const {
      passwordHash,
      verificationToken,
      verificationTokenExpires,
      ...sanitizedUser
    } = user as any;
    return sanitizedUser as UserDto;
  }

  async register(dto: RegisterDto): Promise<UserDto> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phone: dto.phone }, { email: dto.email }] },
    });
    if (existing) {
      throw new ConflictException('Phone or email already in use');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        name: dto.name,
        email: dto.email,
        passwordHash: hash,
        role: dto.role,
        verificationToken: token,
        verificationTokenExpires: expires,
      },
    });

    if (user.email) {
      await this.emailService.sendEmail({
        type: EmailTypes.ACTIVATE,
        data: {
          name: user.name || 'User',
          email: user.email,
          token,
        },
      });
    }

    const payload = { sub: user.id, role: user.role as string };
    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: this.sanitize(user),
    };
  }

  async verifyEmail(
    email: string,
    token: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or token');
    }

    if (user.verified) {
      return { message: 'Email already verified' };
    }

    if (
      user.verificationToken !== token ||
      (user.verificationTokenExpires &&
        user.verificationTokenExpires < new Date())
    ) {
      throw new BadRequestException('Invalid email or token or token expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role as string };
    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: this.sanitize(user),
    };
  }
}
