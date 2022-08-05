import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerService } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
// import * as session from 'express-session';
// import * as sequelizeStore from 'connect-session-sequelize';
import { ValidateInputPipe } from './core/pipes/validate.pipes';
import { ResponseInterceptor } from './core/interceptors/response.interceptors';
// import * as passport from 'passport';
// import { Sequelize } from 'sequelize-typescript';
// import { Session } from './modules/auth/entities/session.entity';
//
// const SequelizeStore = sequelizeStore(session.Store);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  const logger: LoggerService = new Logger();

  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //     store: new SequelizeStore({
  //       db: new Sequelize({ dialect: 'mysql', database: 'keeneye' }),
  //     }),
  //     cookie: {
  //       sameSite: false,
  //       httpOnly: true,
  //       maxAge: 600000,
  //     },
  //   }),
  // );

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');
  // handle all user input validation globally
  app.useGlobalPipes(new ValidateInputPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // app.use(passport.initialize());
  // app.use(passport.session());

  app.use(cors());

  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}
bootstrap();
