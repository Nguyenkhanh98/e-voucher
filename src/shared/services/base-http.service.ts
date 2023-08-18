import { AppLogger } from '@common/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

@Injectable()
export class BaseHttpService implements OnModuleInit {
  private readonly logger: AppLogger;
  constructor(private _httpService: HttpService) {
    this.logger = new AppLogger();
    this.logger.setContext(BaseHttpService.name);
  }

  onModuleInit() {
    const axios = this._httpService.axiosRef;
    axios.interceptors.request.use((config) => this._handleRequest(config));

    axios.interceptors.response.use(
      (response) => this._handleResponse(response),
      (error) => this._handleError(error),
    );
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    config = { ...axios.defaults, ...config } as AxiosRequestConfig;
    const result = this._httpService
      .get(url, config)
      .pipe((res) => res)
      .toPromise();
    return result;
  }

  public async post<T>(
    url,
    body,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    config = { ...axios.defaults, ...config } as AxiosRequestConfig;
    return this._httpService.axiosRef.post(url, body, config);
    // .pipe((res) => res)
    // .toPromise();
    // return result;
  }

  public async put<T>(
    url,
    body,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    config = { ...axios.defaults, ...config } as AxiosRequestConfig;
    const result = this._httpService
      .put(url, body, config)
      .pipe((res) => res)
      .toPromise();
    return result;
  }

  public async delete<T>(
    url,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    config = { ...axios.defaults, ...config } as AxiosRequestConfig;
    return this._httpService.axiosRef.delete<T>(url, config);
    // const result = this._httpService
    //   .delete<T>(url, config)
    //   .pipe((res) => res)
    //   .toPromise();
    // return result;
  }

  get axiosRef(): AxiosInstance {
    return this._httpService.axiosRef as AxiosInstance;
  }

  protected _handleRequest(config: InternalAxiosRequestConfig) {
    try {
      Object.assign(config.headers, { startTime: Date.now() });
      this.logger.log({
        request: {
          baseURL: config.baseURL,
          url: config.url,
          method: config.method,
        },
      });
      return config;
    } catch (e) {
      this.logger.error(e);
    }
  }

  protected _handleResponse(response: AxiosResponse) {
    try {
      const duration = `${
        Date.now() - Number(response.config.headers.startTime)
      }ms`;
      this.logger.log({
        request: {
          baseURL: response.config.baseURL,
          url: response.config.url,
          method: response.config.method,
        },
        response: {
          status: response.status || null,
          data: response.data || null,
        },
        duration,
      });
    } catch (e) {
      this.logger.error(e);
    }
    return response;
  }

  protected _handleError(error: any) {
    try {
      const duration = `${
        Date.now() - Number(error.config.headers.startTime)
      }ms`;
      this.logger.error({
        request: {
          baseURL: error.config.baseURL,
          url: error.config.url,
          method: error.config.method,
        },
        error: {
          code: error.code || error.errorCode || null,
          message: error.message || null,
          response: error.response.data || null,
        },
        duration,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
