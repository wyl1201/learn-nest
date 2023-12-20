import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseFilters,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
  UseGuards,
  UseInterceptors,
  // SetMetadata,
  // ParseIntPipe,
  // UsePipes,
} from '@nestjs/common'
import { CatsService } from './cats.service'
import { CreateCatDto } from './dto/create-cat.dto'
import { UpdateCatDto } from './dto/update-cat.dto'
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter'
import { ValidationPipe } from 'src/validation/validation.pipe'
import { ParseIntPipe } from 'src/parse-int/parse-int.pipe'
import { RolesGuard } from 'src/roles/roles.guard'
import { Roles } from 'src/roles/roles.decorator'
import { LoggingInterceptor } from 'src/logging/logging.interceptor'
import { TransformInterceptor } from 'src/transform/transform.interceptor'

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  // @UsePipes(ValidationPipe)
  @Roles('admin')
  create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto)
  }

  @Get()
  findAll(
    @Query('active', new DefaultValuePipe(false), ParseBoolPipe)
    active: boolean,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    try {
      return this.catsService.findAll({ active, page })
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'This is a custom message' },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      )
    }
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.catsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catsService.update(+id, updateCatDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.remove(+id)
  }
}
