import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ZapService } from './services/zap/zap.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  console.log('Carregando dados de source...')
  await ZapService.getSource()
  console.log('Os dados de source foram carregados com sucesso')
  ZapService.removeInegibleItems()

  await app.listen(process.env.PORT || 3000)
}

bootstrap()
