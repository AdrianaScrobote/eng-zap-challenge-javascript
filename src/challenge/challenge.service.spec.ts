import { Test, TestingModule } from '@nestjs/testing'

import { AppLogger } from '../app.logger'
import { ChallengeService } from './challenge.service'
import { ZapService } from '../services/zap/zap.service'

describe('ChallengeService', () => {
  let service: ChallengeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AppLogger, ChallengeService]
    }).compile()

    service = module.get<ChallengeService>(ChallengeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('filterByOrigin', () => {
    it('should get one item Zap', async () => {
      jest.setTimeout(60000)

      await ZapService.getSource()
      ZapService.removeInegibleItems()

      const expectedItemZap = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 4012,
        listings: [
          {
            usableAreas: 77,
            listingType: 'USED',
            createdAt: '2018-05-08T00:29:38.179Z',
            listingStatus: 'ACTIVE',
            id: 'fed26dbe5881',
            parkingSpaces: 1,
            updatedAt: '2018-05-08T00:29:38.179Z',
            owner: false,
            images: [
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/76a9e6394825a55244e77df2acc2478f.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/bf6583b1f9b624f391fc433eda8090d5.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/2039fab0476b6e5cf17dd3132922f326.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/3f428dea9ff9903d88e62694cdc3e282.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/07aa0b09bffbd51cca83f3f76c1483c2.jpg'
            ],
            address: {
              city: 'São Paulo',
              neighborhood: 'Campo Belo',
              geoLocation: {
                precision: 'ROOFTOP',
                location: {
                  lon: -46.672953,
                  lat: -23.622739
                }
              }
            },
            bathrooms: 3,
            bedrooms: 3,
            pricingInfos: {
              period: 'MONTHLY',
              yearlyIptu: '810',
              price: '3500',
              rentalTotalPrice: '4440',
              businessType: 'RENTAL',
              monthlyCondoFee: '940'
            }
          }
        ]
      }

      const itemZap = await service.filterByOrigin('zap', {
        pageNumber: 1,
        pageSize: 1
      })

      expect(itemZap).toEqual(expectedItemZap)
    })

    it('should get one item Viva Real', async () => {
      jest.setTimeout(60000)

      await ZapService.getSource()
      ZapService.removeInegibleItems()

      const expectedItemVivaReal = {
        pageNumber: 1,
        pageSize: 1,
        totalCount: 5022,
        listings: [
          {
            usableAreas: 69,
            listingType: 'USED',
            createdAt: '2016-11-16T04:14:02Z',
            listingStatus: 'ACTIVE',
            id: 'a0f9d9647551',
            parkingSpaces: 1,
            updatedAt: '2016-11-16T04:14:02Z',
            owner: false,
            images: [
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/285805119ab0761500127aebd8ab0e1d.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/4af1656b66b9e12efff6ce06f51926f6.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/895f0d4ce1e641fd5c3aad48eff83ac8.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/e7b5cce2d9aee78867328dfa0a7ba4c6.jpg',
              'https://resizedimgs.vivareal.com/crop/400x300/vr.images.sp/d833da4cdf6b25b7acf3ae0710d3286d.jpg'
            ],
            address: {
              city: '',
              neighborhood: '',
              geoLocation: {
                precision: 'ROOFTOP',
                location: {
                  lon: -46.716542,
                  lat: -23.502555
                }
              }
            },
            bathrooms: 2,
            bedrooms: 3,
            pricingInfos: {
              yearlyIptu: '0',
              price: '405000',
              businessType: 'SALE',
              monthlyCondoFee: '495'
            }
          }
        ]
      }

      const itemVivaReal = await service.filterByOrigin('vivareal', {
        pageNumber: 1,
        pageSize: 1
      })

      expect(itemVivaReal).toEqual(expectedItemVivaReal)
    })
  })
})
