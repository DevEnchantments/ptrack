import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get('saved')
  listSaved(@CurrentUser() user: AuthUser) {
    return this.search.listSaved(user.id);
  }

  @Post('saved')
  @ApiBody({
    type: CreateSavedSearchDto,
    examples: {
      minimal: {
        summary: 'Save the current query',
        value: { name: 'Screening work', query: 'screening' },
      },
    },
  })
  addSaved(@Body() dto: CreateSavedSearchDto, @CurrentUser() user: AuthUser) {
    return this.search.addSaved(user.id, dto);
  }

  @Delete('saved/:savedSearchId')
  removeSaved(
    @Param('savedSearchId', ParseUUIDPipe) savedSearchId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.search.removeSaved(user.id, savedSearchId);
  }

  @Get()
  query(@Query('q') q: string, @CurrentUser() user: AuthUser) {
    return this.search.search(q ?? '', user.id);
  }
}
