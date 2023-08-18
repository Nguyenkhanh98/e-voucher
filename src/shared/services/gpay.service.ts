import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import { ENV } from '@common/config';
import { BaseHttpService } from './base-http.service';
import { generateSignatureGpay } from '@common/utils';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@common/logger/logger.service';
import { AppException } from '@common/exceptions/app-exception';
import { GPAY_REQUEST_ERROR } from '@common/exceptions/error';

@Injectable()
export class GPayHttpService {
  constructor(
    private readonly _http: BaseHttpService,
    private _config: ConfigService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(GPayHttpService.name);
  }

  async post(
    action: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    const url = `${ENV.GPAY.URL}/${action}`;

    try {
      const defaultHeader = await this.initConfigHeader(body);
      const configCustom = await this.initConfig(defaultHeader, config);
      const result = await this._http.post(url, body, configCustom);
      this.logger.log({
        path: action,
        config: configCustom,
      });
      return result;
    } catch (err) {
      this.logger.error(
        err.message,
        JSON.stringify({
          path: action,
          config: config,
        }),
      );
      throw new AppException(GPAY_REQUEST_ERROR);
    }
  }

  private async initConfig(headers, config?: AxiosRequestConfig) {
    {
      if (!config) {
        return {
          headers,
        };
      }
      if (!config.headers) {
        return { ...config, headers };
      }
      return {
        ...config,
        headers: {
          ...headers,
          ...config.headers,
        },
      };
    }
  }

  private async initConfigHeader(body: any) {
    {
      return {
        apiKey: this._config.get('GPAY_API_KEY'),
        signature: generateSignatureGpay(body, this._config.get('GPAY_SALT')),
      };
    }
  }
}
