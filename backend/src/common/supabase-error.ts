import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { PostgrestError } from '@supabase/supabase-js';

const logger = new Logger('Supabase');

/** Maps a Postgres/PostgREST error to a clean HTTP error (no raw DB leaks). */
export function toHttpException(
  error: PostgrestError,
  context: string,
): HttpException {
  logger.error(`${context} failed: ${error.code} ${error.message}`);
  switch (error.code) {
    case '23503': // foreign_key_violation
      return new BadRequestException('A referenced record does not exist.');
    case '23505': // unique_violation
      return new ConflictException('A record with these values already exists.');
    case '23502': // not_null_violation
      return new BadRequestException('A required field is missing.');
    case '23514': // check_violation
      return new BadRequestException('A value is not allowed.');
    default:
      return new InternalServerErrorException('Unexpected database error.');
  }
}