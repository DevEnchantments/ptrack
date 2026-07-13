import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** The logged-in user the guard attaches to each request. */
export interface AuthUser {
  id: string;
  email: string | null;
}

/** Injects the current user in a controller: `@CurrentUser() user: AuthUser`. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
