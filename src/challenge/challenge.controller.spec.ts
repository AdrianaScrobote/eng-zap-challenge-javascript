import { Test, TestingModule } from '@nestjs/testing'

import { AppLogger } from '../app.logger'
import { ChallengeController } from './challenge.controller'
import { ChallengeService } from './challenge.service'

describe('ChallengeController', () => {
  let controller: ChallengeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeController],
      providers: [
        AppLogger,
        {
          provide: ChallengeService,
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<ChallengeController>(ChallengeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
