import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  AttachmentsService,
  type UploadedFileLike,
} from './attachments.service';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import {
  CurrentUser,
  type AuthUser,
} from '../../common/decorators/current-user.decorator';

@Controller('projects/:projectId/attachments')
export class AttachmentsController {
  constructor(private readonly attachments: AttachmentsService) {}

  @Get()
  list(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.attachments.list(projectId);
  }

  // The Swagger plugin cannot infer a multipart body from FileInterceptor, so
  // the upload contract is declared by hand. Fields arrive as form-data strings:
  // the service coerces is_gold and splits tags on commas.
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (max 100 MB).',
        },
        is_gold: {
          type: 'string',
          enum: ['true', 'false'],
          description: 'Truthy when "true" or "1".',
        },
        tags: {
          type: 'string',
          description: 'Comma-separated list, e.g. "budget,q3".',
        },
        description: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }),
  )
  add(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @UploadedFile() file: UploadedFileLike,
    @Body() body: Record<string, string>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.attachments.create(projectId, file, body, user.id);
  }

  @Get(':attachmentId')
  get(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
  ) {
    return this.attachments.get(projectId, attachmentId);
  }

  @Get(':attachmentId/download')
  download(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
  ) {
    return this.attachments.getDownloadUrl(projectId, attachmentId);
  }

  @Patch(':attachmentId')
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Body() dto: UpdateAttachmentDto,
  ) {
    return this.attachments.update(projectId, attachmentId, dto);
  }

  @Delete(':attachmentId')
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
  ) {
    return this.attachments.remove(projectId, attachmentId);
  }
}
