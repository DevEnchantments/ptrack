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

  @Post()
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