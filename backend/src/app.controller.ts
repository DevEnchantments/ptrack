import { Controller, Get } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Public() skips the global SupabaseAuthGuard; ApiSecurity({}) clears the
  // global bearer requirement so the docs don't advertise a token it ignores.
  @Public()
  @ApiSecurity({})
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
