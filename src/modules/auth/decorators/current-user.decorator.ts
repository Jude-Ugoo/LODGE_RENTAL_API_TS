import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SanitizedUser } from '../types/sanitized-user.type';

export const CurrentUser = createParamDecorator(
  (data: keyof SanitizedUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user as SanitizedUser;

    return data ? user?.[data] : user;
  },
);
