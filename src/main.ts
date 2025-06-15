import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AgencyContextMiddleware } from './common/middleware/agency-context.middleware';
import { AgenciesService } from './agencies/agencies.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: "http://localhost:3000", // React app's dev server	
    credentials: true,
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'x-agency-id', 
    ],
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
