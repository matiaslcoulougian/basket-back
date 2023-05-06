import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.use(cors({
        origin: '*',
    }))
    app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`🚀 Application started on localhost ${port} 🚀`);
}
bootstrap();
