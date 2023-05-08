import { Express } from 'express';
import { CloudinaryService } from 'nestjs-cloudinary';

import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../constants/authentication';
import { AccessJwtAuthGuard } from '../guards/jwt.guard';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('upload-and-get-url')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAndGetUrl(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFileAndGetUrl(file);
  }
}
