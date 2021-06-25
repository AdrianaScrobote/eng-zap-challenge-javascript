import { UnauthorizedException } from '@nestjs/common'
import { AppLogger } from '../app.logger'
import { ZapService } from '../services/zap/zap.service'
import { BoudingBoxEnum } from './enum/boudingBox'
import { pagination } from '../services/helpers/pagination'

export class ChallengeService {
  /* eslint-disable no-useless-constructor */
  constructor(private readonly logger: AppLogger) {}

  public async filterByOrigin(
    origin: string,
    queryOpts: object
  ): Promise<object> {
    if (origin !== 'zap' && origin !== 'vivareal') {
      throw new UnauthorizedException(
        'Por favor, informe uma origem válida! Deve ser zap ou vivareal.'
      )
    }

    if (!queryOpts['pageNumber'] || queryOpts['pageNumber'] < 1) {
      queryOpts['pageNumber'] = 1
    } else if (!/^\d*$/.test(queryOpts['pageNumber'])) {
      throw new UnauthorizedException(
        'O parâmetro pageNumber deve ser um número!'
      )
    }

    if (!queryOpts['pageSize'] || queryOpts['pageSize'] < 1) {
      queryOpts['pageSize'] = 100
    } else if (!/^\d*$/.test(queryOpts['pageSize'])) {
      throw new UnauthorizedException(
        'O parâmetro pageSize deve ser um número!'
      )
    }

    let result
    if (origin === 'zap') {
      result = await this.filterByZap()
    } else {
      result = await this.filterByVivaReal()
    }

    const totalItems = result.length
    const end = queryOpts['pageNumber'] * queryOpts['pageSize']
    const start = end - queryOpts['pageSize']
    result = result.slice(start, end)

    return pagination(
      result,
      totalItems,
      parseInt(queryOpts['pageSize']),
      parseInt(queryOpts['pageNumber'])
    )
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
    ).then((values) => {
      return values.filter((item) => item)
    })

    return result
  }

  public async filterByVivaReal(): Promise<object> {
    const maxRentalPrice = 4000
    const maxRentalPriceBoudingBox = await this.getMaxRentalPriceByBoudingBox(
      maxRentalPrice
    )

    const result = await Promise.all(
      ZapService.dataSource.map(async (item) => {
        if (
          item.pricingInfos.businessType === 'SALE' &&
          item.pricingInfos.price <= 700000
        ) {
          return item
        } else if (item.pricingInfos.businessType === 'RENTAL') {
          const valueMaxRentalPrice = await this.getMaxRentalPriceVivaReal(
            item.address.geoLocation.location.lon,
            item.address.geoLocation.location.lat,
            maxRentalPrice,
            maxRentalPriceBoudingBox
          )

          if (item.pricingInfos.rentalTotalPrice <= valueMaxRentalPrice) {
            return item
          }
        }
      })
    ).then((values) => {
      return values.filter((item) => item)
    })

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

  public async getMaxRentalPriceByBoudingBox(
    priceItem: number
  ): Promise<number> {
    let differencePrice
    if (priceItem) {
      differencePrice = (priceItem * 50) / 100
      differencePrice = Math.round(differencePrice * 100) / 100
      priceItem = priceItem + differencePrice
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

  public async getMaxRentalPriceVivaReal(
    lon: number,
    lat: number,
    maxRentalPrice: number,
    maxRentalBoudingBox: number
  ): Promise<number> {
    let valueMaxRentalPrice
    const isBoundingBox = await this.isBoudingBox(lon, lat)

    if (isBoundingBox) {
      valueMaxRentalPrice = maxRentalBoudingBox
    } else {
      valueMaxRentalPrice = maxRentalPrice
    }
    return valueMaxRentalPrice
  }
}
