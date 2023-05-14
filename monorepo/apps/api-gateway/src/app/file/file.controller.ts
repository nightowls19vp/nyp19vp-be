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
import { UpdateAvatarWithBase64 } from '@nyp19vp-be/shared';
import { ATUser } from '../decorators/at-user.decorator';
import { AccessJwtAuthGuard } from '../auth/guards/jwt.guard';

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
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadAvatar(
    @ATUser() user: unknown,
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
    return this.fileService.uploadAvatar(
      user?.['auth']?.['user']?.['id'] ||
        user?.['userInfo']?.['_id'] ||
        'default',
      file,
    );
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('upload-avatar-with-base64')
  async uploadAvatarWithBase64(
    @ATUser() user: unknown,
    @Body() reqDto: UpdateAvatarWithBase64,
  ) {
    return this.fileService.uploadAvatarWithBase64(
      user?.['auth']?.['user']?.['id'] ||
        user?.['userInfo']?.['_id'] ||
        'default',
      reqDto.base64,
    );
  }
}
