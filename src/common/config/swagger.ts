import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('VJA')
  .setDescription('Vietjet voucher api')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const initSwapper = (app: NestExpressApplication) => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
