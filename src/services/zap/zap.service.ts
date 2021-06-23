import {
  HttpException,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common'

import axios from 'axios'

export class ZapService {
  public static dataSource

  public static async getSource(): Promise<void> {
    return axios
      .get(
        'http://grupozap-code-challenge.s3-website-us-east-1.amazonaws.com/sources/source-2.json'
      )
      .then((response) => {
        if (response.status === 200) {
          this.dataSource = response.data
        } else {
          throw new UnauthorizedException(
            'Não foi possível carregar os dados de source! Por favor, reinicie o servidor!'
          )
        }
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
      })
  }

  public static removeInegibleItems() {
    this.dataSource = ZapService.dataSource.filter((item) => {
      return (
        item.address.geoLocation.location.lon !== 0 &&
        item.address.geoLocation.location.lat !== 0
      )
    })
  }
}
