import { Module } from '@nestjs/common'
import { AppLogger } from '../app.logger'
import { ChallengeController } from './challenge.controller'
import { ChallengeService } from './challenge.service'

@Module({
  imports: [],
  controllers: [ChallengeController],
  providers: [AppLogger, ChallengeService]
})
export class ChallengeModule {}
