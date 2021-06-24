import {
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Param
} from '@nestjs/common'

import { AppLogger } from '../app.logger'

import { ChallengeService } from './challenge.service'

@Controller('challenge')
export class ChallengeController {
  constructor(
    private readonly logger: AppLogger,
    private readonly challengeService: ChallengeService
  ) {
    this.logger.setContext('challengeController')
  }

  @Get(':origin')
  public async filterByOrigin(
    @Param('origin') origin: string
  ): Promise<object> {
    try {
      return this.challengeService.filterByOrigin(origin)
    } catch (err) {
      this.logger.error(err)
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
