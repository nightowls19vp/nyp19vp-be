import { Express } from 'express';
import { Multer } from 'multer';
import {
  Body,
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../constants/authentication';
import { AccessJwtAuthGuard } from '../guards/jwt.guard';
import { UpdateAvatarWithBase64 } from '@nyp19vp-be/shared';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadFile(
    @UploadedFile(
      'file',
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadFile(file);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('upload-and-get-url')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadFileAndGetUrl(
    @UploadedFile(
      'file',
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadFileAndGetUrl(file);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: "User's Id" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile(
      'file',
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadAvatar(id, file);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/upload-avatar-with-base64')
  @ApiParam({ name: 'id', type: String, description: "User's Id" })
  async uploadAvatarWithBase64(
    @Param('id') id: string,
    @Req() req: Express.Request,
    @Body() reqDto: UpdateAvatarWithBase64,
  ) {
    // convert base 64 to Express.Multer.File with fetch

    return this.fileService.uploadAvatarWithBase64(
      req?.user['id'] ?? id,
      reqDto.base64,
    );
  }
}
