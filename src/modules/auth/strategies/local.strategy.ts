import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { SanitizedUser } from '../types/sanitized-user.type';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super({ usernameField: 'phone', passwordField: 'password' });
  }

  async validate(phone: string, password: string): Promise<SanitizedUser> {
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
