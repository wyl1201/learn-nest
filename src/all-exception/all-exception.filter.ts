import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import {
  AbstractHttpAdapter,
  // BaseExceptionFilter,
  // HttpAdapterHost,
} from '@nestjs/core'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // const { httpAdapter } = this.httpAdapterHost
    const httpAdapter = this.httpAdapter

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}

// @Catch()
// export class AllExceptionFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     super.catch(exception, host)
//   }
// }
