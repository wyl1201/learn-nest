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
  ForbiddenException,
} from '@nestjs/common'
import { CatsService } from './cats.service'
import { CreateCatDto } from './dto/create-cat.dto'
import { UpdateCatDto } from './dto/update-cat.dto'
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter'

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    throw new ForbiddenException()
    return this.catsService.create(createCatDto)
  }

  @Get()
  findAll() {
    throw new Error('')
    try {
      return this.catsService.findAll()
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
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id)
  }
}
