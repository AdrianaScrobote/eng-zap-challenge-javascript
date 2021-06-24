import { UnauthorizedException } from '@nestjs/common'
import { AppLogger } from '../app.logger'
import { ZapService } from '../services/zap/zap.service'
import { BoudingBoxEnum } from './enum/boudingBox'

export class ChallengeService {
  /* eslint-disable no-useless-constructor */
  constructor(private readonly logger: AppLogger) {}

  public async filterByOrigin(origin: string): Promise<object> {
    if (origin !== 'zap' && origin !== 'vivareal') {
      throw new UnauthorizedException(
        'Por favor, informe uma origem válida! Deve ser zap ou vivareal.'
      )
    }

    let result
    if (origin === 'zap') {
      result = await this.filterByZap()
    } else {
      result = this.filterByVivaReal()
    }

    return result
  }

  public async filterByZap(): Promise<object> {
    const minSalePrice = 600000
    const minSalePriceBoudingBox = await this.getMinSalePriceByBoudingBox(
      minSalePrice
    )

    const result = await Promise.all(
      ZapService.dataSource.map(async (item) => {
        if (item.pricingInfos.businessType === 'SALE') {
          const valueMinSalePrice = await this.getMinSalePriceZap(
            item.address.geoLocation.location.lon,
            item.address.geoLocation.location.lat,
            minSalePrice,
            minSalePriceBoudingBox
          )

          const squareMeterPrice = await this.getSquareMeterPrice(
            item.pricingInfos.price,
            item.usableAreas
          )

          if (
            item.pricingInfos.price >= valueMinSalePrice &&
            squareMeterPrice > 3500
          ) {
            return item
          }
        } else if (
          item.pricingInfos.businessType === 'RENTAL' &&
          item.pricingInfos.rentalTotalPrice >= 3500
        ) {
          return item
        }
      })
    ).then((result) => {
      result = <any>result.filter((item) => item)
      return result
    })

    return result
  }

  public async filterByVivaReal(): Promise<object> {
    const result = []
    return result
  }

  public async getSquareMeterPrice(
    priceItem: number,
    usableAreas: number
  ): Promise<Number> {
    let result = 0

    if (usableAreas > 0) {
      result = priceItem / usableAreas
      result = Math.round(result * 100) / 100
    }

    return result
  }

  public async getMinSalePriceByBoudingBox(priceItem: number): Promise<number> {
    let differencePrice
    if (priceItem) {
      differencePrice = (priceItem * 10) / 100
      differencePrice = Math.round(differencePrice * 100) / 100
      priceItem = priceItem - differencePrice
    }

    return priceItem
  }

  public async isBoudingBox(lon: number, lat: number): Promise<boolean> {
    let isBoundingBox = false

    if (
      lon <= BoudingBoxEnum.maxlon &&
      lon >= BoudingBoxEnum.minlon &&
      lat <= BoudingBoxEnum.maxlat &&
      lat >= BoudingBoxEnum.minlat
    ) {
      isBoundingBox = true
    }

    return isBoundingBox
  }

  public async getMinSalePriceZap(
    lon: number,
    lat: number,
    minSalePrice: number,
    minSalePriceBoudingBox: number
  ): Promise<number> {
    let valueMinSalePrice
    const isBoundingBox = await this.isBoudingBox(lon, lat)

    if (isBoundingBox) {
      valueMinSalePrice = minSalePriceBoudingBox
    } else {
      valueMinSalePrice = minSalePrice
    }
    return valueMinSalePrice
  }
}
