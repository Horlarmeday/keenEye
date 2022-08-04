import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerService } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { ValidateInputPipe } from './core/pipes/validate.pipes';
import { ResponseInterceptor } from './core/interceptors/response.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  const logger: LoggerService = new Logger();

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(morgan('dev'));
  // handle all user input validation globally
  app.useGlobalPipes(new ValidateInputPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}
bootstrap();
