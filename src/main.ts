import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;
  app.setGlobalPrefix('api');
  await app.listen(port);
  console.log(`🚀 Application started on localhost ${port} 🚀`);
}
bootstrap();
