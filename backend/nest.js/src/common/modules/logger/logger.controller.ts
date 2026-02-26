import { Controller, Delete, Get, Res } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { type Response } from 'express';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get('errors')
  async getErrorLogs(@Res() res: Response) {
    try {
      const logs = (await this.loggerService.getErrorLogs()) as string;
      res.setHeader('Content-Type', 'text/plain');
      res.send(logs);
    } catch (error) {
      res.status(500).send('Error retrieving logs');
    }
  }

  @Delete('errors')
  async clearErrorLogs() {
    return (await this.loggerService.clearErrorLogs()) as { message: string };
  }
}
