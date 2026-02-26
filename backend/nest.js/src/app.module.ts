import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from 'config/app.config';
import databaseConfig from 'config/database.config';
import envVariableValidationSchema from 'config/env_validation.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './common/modules/users/user.module';
import { TaskModule } from './common/modules/tasks/task.module';
import { TaskAssignmentModule } from './common/modules/task-assignments/task-assignment.module';
import { ProjectModule } from './common/modules/project/project.module';
import { TeamModule } from './common/modules/teams/team.module';
import { CommentModule } from './common/modules/comments/comment.module';
import { AttachmentModule } from './common/modules/attachments/attachment.module';
import { LoggerModule } from './common/modules/logger/logger.module';
import { LoggerService } from './common/modules/logger/logger.service';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${ENV ? `.${ENV.trim()}` : ''}`,
      load: [appConfig, databaseConfig],
      validationSchema: envVariableValidationSchema,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs', 'app.log'),
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs', 'error.log'),
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: config.get<boolean>('database.autoLoadEntities'),
        synchronize: config.get<boolean>('database.synchronize'),
        dropSchema: true,
      }),
    }),
    UserModule,
    TaskModule,
    TaskAssignmentModule,
    AttachmentModule,
    CommentModule,
    TeamModule,
    ProjectModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly loggerService: LoggerService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.loggerService.accessLogger, this.loggerService.errorLogger)
      .forRoutes('*');
  }
}
