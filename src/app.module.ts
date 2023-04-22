import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRepository, IAppRepository } from "./app.repository";

const appRepositoryProvider = {
  provide: IAppRepository,
  useClass: AppRepository,
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, appRepositoryProvider],
})
export class AppModule {}
