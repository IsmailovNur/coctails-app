import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../middlewares/auth.guard.js';
import { CocktailsService } from './cocktails.service.js';
import { RolesGuard } from '../middlewares/roles.guard.js';
import type { RequestWithUser } from '../types.js';
import { Roles } from '../decorators/roles.decorator.js';
import { CreateCocktailDto } from './create.cocktail.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublishCocktailDto } from './publish.cocktail.dto.js';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { extname } from 'path';

@Controller('cocktails')
export class CocktailsController {
  constructor(private cocktailsService: CocktailsService) {}

  @Get()
  async getAll() {
    return this.cocktailsService.getPublished();
  }

  @UseGuards(AuthGuard)
  @Get('/my')
  async getMyCocktails(
    @Req()
    request: RequestWithUser,
  ) {
    return this.cocktailsService.getMy(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin')
  async getAllForAdmin() {
    return this.cocktailsService.getAllForAdmin();
  }

  @Get(':id')
  async getOne(
    @Param('id')
    id: string,
  ) {
    return this.cocktailsService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images/cocktails',
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname);

          callback(null, `${randomUUID()}${extension}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile()
    uploadedFile: Express.Multer.File,

    @Body()
    cocktailDto: CreateCocktailDto,

    @Req()
    request: RequestWithUser,
  ) {
    return this.cocktailsService.create(cocktailDto, uploadedFile, request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/publish')
  async publish(
    @Param('id')
    id: string,

    @Body()
    publishDto: PublishCocktailDto,
  ) {
    return this.cocktailsService.publish(id, publishDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(
    @Param('id')
    id: string,

    @Req()
    request: RequestWithUser,
  ) {
    return this.cocktailsService.delete(id, request);
  }
}
