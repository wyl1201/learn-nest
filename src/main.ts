import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionFilter } from './all-exception/all-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const { httpAdapter } = app.get(HttpAdapterHost)

  // filter
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter))

  await app.listen(3000)
}
bootstrap()
