import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiProduces } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AssistantService, AssistantEvent } from './assistant.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ExecuteActionDto } from './dto/execute-action.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  /** Lets the UI show a "not configured" state instead of a dead chat box. */
  @Get('status')
  status() {
    return { configured: this.assistant.configured };
  }

  /**
   * One chat turn, streamed as Server-Sent Events. The caller's own JWT is
   * forwarded to every tool call, so the assistant is bounded by the user's
   * access — it can neither see nor do more than the user could in the UI.
   */
  @Post('chat')
  @ApiOperation({ summary: 'Chat with the assistant (SSE stream)' })
  @ApiProduces('text/event-stream')
  async chat(
    @Body() dto: ChatRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const emit = (event: AssistantEvent) => {
      if (!res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    try {
      await this.assistant.chat(dto.messages, authorization, emit);
    } catch (err) {
      emit({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'The assistant hit an error.',
      });
    } finally {
      res.end();
    }
  }

  /**
   * Executes one write action the user confirmed in the chat UI. The action
   * is rebuilt from the write-tool catalog (arbitrary calls are impossible)
   * and runs under the caller's own JWT, so the guard chain authorizes it
   * exactly like a hand-made request.
   */
  @Post('execute')
  @ApiOperation({ summary: 'Execute a user-confirmed assistant action' })
  execute(@Body() dto: ExecuteActionDto, @Req() req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    return this.assistant.execute(dto.tool, dto.input, authorization);
  }
}
