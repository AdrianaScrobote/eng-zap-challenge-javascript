import { Module } from '@nestjs/common'
import { ChallengeModule } from './challenge/challenge.module'

@Module({
  imports: [ChallengeModule],
  controllers: [],
  providers: []
})
export class AppModule {}
