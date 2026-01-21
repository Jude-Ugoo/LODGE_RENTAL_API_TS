import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('User')
@ApiBearerAuth('Authorization')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users (restricted)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.LANDLORD, Role.AGENT)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() currentUser: any) {
    // allow user to fetch own record or allow privileged roles
    if (currentUser.id === id) return this.userService.findById(id);
    // if ([Role.LANDLORD, Role.AGENT].includes(currentUser.role))
      return this.userService.findById(id);
    // otherwise not allowed
    throw new Error('Forbidden');
  }

  @ApiOperation({ summary: 'Change password for current user' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
