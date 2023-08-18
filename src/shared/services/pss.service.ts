import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import { ENV } from '@common/config';
import { AppException } from '@common/exceptions/app-exception';
import { PSS_REQUEST_ERROR } from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import { BaseHttpService } from './base-http.service';

@Injectable()
export class PssHttpService {
  constructor(
    private readonly _http: BaseHttpService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(PssHttpService.name);
  }

  async get(
    action: string,
    config?: AxiosRequestConfig,
    ignoreAuth = false,
  ): Promise<any> {
    const url = `${ENV.PSS.URL}/${action}`;

    try {
      if (!ignoreAuth) {
        config = await this.initConfigHeader(config);
      }
      const result = await this._http.get(url, config);

      this.logger.log({ path: action, config: config });

      return result;
    } catch (err) {
      this.logger.error(
        err.response.data.message || err.message,
        JSON.stringify({
          path: action,
          config: config,
        }),
      );
      throw new AppException(PSS_REQUEST_ERROR);
    }
  }

  async post(
    action: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    const url = `${ENV.PSS.URL}/${action}`;

    try {
      config = await this.initConfigHeader(config);
      const result = await this._http.post(url, body, config);
      this.logger.log({ path: action, config: config });
      return result;
    } catch (err) {
      this.logger.error(
        err.response.data.message,
        JSON.stringify({
          path: action,
          config: config,
        }),
      );
      throw new AppException(PSS_REQUEST_ERROR);
    }
  }

  async put(
    action: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    const url = `${ENV.PSS.URL}/${action}`;

    try {
      config = await this.initConfigHeader(config);
      const result = await this._http.put(url, body, config);
      this.logger.log({ path: action, config: config });
      return result;
    } catch (err) {
      this.logger.error(
        err.response.data.message,
        JSON.stringify({
          path: action,
          config: config,
        }),
      );
      throw new AppException(PSS_REQUEST_ERROR);
    }
  }

  async delete(action: string, config?: AxiosRequestConfig): Promise<any> {
    const url = `${ENV.PSS.URL}}/${action}`;

    try {
      config = await this.initConfigHeader(config);
      const result = await this._http.delete(url, config);
      this.logger.log({ path: action, config: config });

      return result;
    } catch (err) {
      this.logger.error(
        err.response.data.message,
        JSON.stringify({
          path: action,
          config: config,
        }),
      );
      throw new AppException(PSS_REQUEST_ERROR);
    }
  }

  private async initConfigHeader(config?: AxiosRequestConfig) {
    if (!config) {
      config = {
        auth: {
          username: ENV.PSS.USERNAME,
          password: ENV.PSS.PASSWORD,
        },
      };
    }

    if (!config.auth) {
      config['auth'] = {
        username: ENV.PSS.USERNAME,
        password: ENV.PSS.PASSWORD,
      };
    }

    return config;
  }
}
