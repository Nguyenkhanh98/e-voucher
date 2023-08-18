import { Global, Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BaseHttpService } from './services/base-http.service';
import { GPayHttpService } from './services/gpay.service';
import { MailService } from './services/mail.service';
import { PssHttpService } from './services/pss.service';
import { LoggerModule } from '@common/logger/logger.module';
import { HttpModule } from '@nestjs/axios';

const providers = [
  MailService,
  BaseHttpService,
  PssHttpService,
  GPayHttpService,
];

@Global()
@Module({
  providers,
  imports: [
    LoggerModule,
    HttpModule.register({}),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT') || 587,
          secure: false, // use TLS
          auth: {
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get('MAIL_FROMNAME')}" <${configService.get(
            'MAIL_FROMADDRESS',
          )}>`,
        },
      }),
    }),
  ],
  exports: [...providers],
})
export class SharedModule {}
