import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as open — skips the auth guard. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);