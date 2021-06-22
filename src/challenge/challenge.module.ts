import { Module } from '@nestjs/common'
import { ChallengeController } from './challenge.controller'
import { AppLogger } from '../app.logger'

@Module({
  controllers: [ChallengeController],
  providers: [AppLogger]
})
export class ChallengeModule {}
