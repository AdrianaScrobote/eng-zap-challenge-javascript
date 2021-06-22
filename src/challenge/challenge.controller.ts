import {
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Param
} from '@nestjs/common'

import { AppLogger } from '../app.logger'

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext('challengeController')
  }

  @Get(':origem')
  public async findAll(@Param('origem') origem: string): Promise<boolean> {
    try {
      if (origem) {
        return true
      }
    } catch (err) {
      this.logger.error(err)
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
