import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { CustomerEntity } from '@common/entities';
import { loadStatic } from '@common/utils/static';
import { formatTemplate } from '@common/utils/format';
import { AppLogger } from '@common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(MailService.name);
  }

  async sendEmailActiveCustomer(customer: CustomerEntity) {
    const source = loadStatic('/templates/active-customer.html');
    const url = `${this.configService.get('ACTIVE_CUSTOMER_URL')}?key=${
      customer.activeKey
    }`;
    const template = formatTemplate(source, {
      url: url,
    });
    await this.mailerService
      .sendMail({
        to: customer.email,
        subject: 'Active account',
        html: template,
      })
      .catch((err) => {
        this.logger.error(err.message, 'sendEmailActiveCustomer');
      });
  }

  async sendEmailForgotPassword(email: string, key: string, isUser: boolean) {
    const source = loadStatic('/templates/forgot-password.html');
    const url = isUser
      ? `${this.configService.get('FORGOT_PASSWORD_USER_URL')}?key=${key}`
      : `${this.configService.get('FORGOT_PASSWORD_CUSTOMER_URL')}?key=${key}`;
    const template = formatTemplate(source, {
      url: url,
    });
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Forgot password',
        html: template,
      })
      .catch((err) => {
        this.logger.error(err.message, 'sendEmailForgotPassword');
      });
  }

  async sendEmailVoucherClaim(data: any) {
    const source = loadStatic('/templates/claim-voucher.html');
    const template = formatTemplate(source, {
      vouchers: JSON.stringify(data.vouchers),
    });
    await this.mailerService
      .sendMail({
        to: data.email,
        subject: data.voucherType + ' Voucher Claim',
        html: template,
      })
      .catch((err) => {
        this.logger.error(err.message, 'sendEmailVoucherClaim');
      });
  }
}
