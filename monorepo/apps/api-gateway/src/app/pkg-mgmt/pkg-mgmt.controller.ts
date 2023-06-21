import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  OnModuleInit,
  Inject,
  Put,
  Query,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AddGrMbReqDto,
  RmGrMbReqDto,
  CreateGrReqDto,
  GetGrResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrPkgReqDto,
  GrCollectionProperties,
  GroupDto,
  ParseObjectIdPipe,
  BaseResDto,
  MemberDto,
  GetGrsByUserResDto,
  UpdateAvatarReqDto,
  ActivateGrPkgReqDto,
  PkgGrInvReqDto,
  UpdateChannelReqDto,
  GetGrChannelResDto,
} from '@nyp19vp-be/shared';
import { PkgMgmtService } from './pkg-mgmt.service';
import {
  CollectionDto,
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Types } from 'mongoose';
import { AccessJwtAuthGuard } from '../auth/guards/jwt.guard';
import { ATUser } from '../decorators/at-user.decorator';
import { isEmpty } from 'class-validator';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../constants/authentication';

@ApiTags('Package Management')
@Controller('pkg-mgmt')
export class PkgMgmtController implements OnModuleInit {
  constructor(
    private readonly pkgMgmtService: PkgMgmtService,
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.packageMgmtClient.subscribeToResponseOf(
      kafkaTopic.HEALT_CHECK.PACKAGE_MGMT,
    );

    for (const key in kafkaTopic.PACKAGE_MGMT) {
      this.packageMgmtClient.subscribeToResponseOf(
        kafkaTopic.PACKAGE_MGMT[key],
      );
    }

    // subscribe to kafka topics "kafkaTopic.AUTH.GENERATE_JOIN_GR_TOKEN"
    this.authClient.subscribeToResponseOf(
      kafkaTopic.AUTH.GENERATE_JOIN_GR_TOKEN,
    );

    this.authClient.subscribeToResponseOf(
      kafkaTopic.AUTH.VALIDATE_JOIN_GR_TOKEN,
    );

    await Promise.all([this.packageMgmtClient.connect()]);
  }

  @Post('gr')
  @ApiCreatedResponse({ description: 'Created Group', type: BaseResDto })
  createGr(@Body() createGrReqDto: CreateGrReqDto): Promise<BaseResDto> {
    console.log('create group', createGrReqDto);
    return this.pkgMgmtService.createGr(createGrReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('gr')
  @ApiOperation({
    description:
      'Filter MUST:\n\n\t- name(Optional): {"name":{"$regex":"(?i)(<keyword>)(?-i)"}}',
  })
  @ApiOkResponse({ description: 'Get All Groups', type: GroupDto })
  getAllGr(
    @Query(new ValidationPipe(GrCollectionProperties))
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<GroupDto>> {
    console.log('Get all groups');
    return this.pkgMgmtService.getAllGr(collectionDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('gr/user_id')
  @ApiQuery({ name: 'role', enum: ['All', 'User', 'Super User'] })
  getGrByUserId(
    @ATUser() user: unknown,
    @Query('role') role: string,
  ): Promise<GetGrsByUserResDto> {
    console.log("Get groups by user's id", user['userInfo']['_id']);
    const memberDto: MemberDto = { user: user['userInfo']['_id'], role };
    return this.pkgMgmtService.getGrByUserId(memberDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('gr/user_id/channel')
  getGrChannelByUserId(@ATUser() user: unknown): Promise<GetGrChannelResDto> {
    console.log("Get groups by user's id", user['userInfo']['_id']);
    const id: Types.ObjectId = new Types.ObjectId(user['userInfo']['_id']);
    return this.pkgMgmtService.getGrChannelByUserId(id);
  }

  // create a magic link to invite user to join group
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @ApiOkResponse({ description: 'Join group by magic link', type: BaseResDto })
  @UseGuards(AccessJwtAuthGuard)
  @Post('gr/inv')
  invToJoinGr(
    @Body() reqDto: PkgGrInvReqDto,
    @ATUser() user: unknown,
  ): Promise<BaseResDto> {
    console.log(
      `invite ${JSON.stringify(reqDto.emails)} to join group #${
        reqDto.grId
      } by user #${user['userInfo']['_id']}`,
    );

    if (isEmpty(user?.['userInfo']?.['_id'])) {
      throw new UnauthorizedException();
    }

    reqDto.addedBy = user['userInfo']['_id'];

    if (isEmpty(reqDto.emails)) {
      throw new BadRequestException('No email to invite');
    }

    if (!reqDto.addedBy) {
      throw new UnauthorizedException("Can't get user's id");
    }

    return this.pkgMgmtService.invToJoinGr(reqDto);
  }

  // join group by magic link
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @ApiOkResponse({ description: 'Join group by magic link', type: BaseResDto })
  @ApiQuery({ name: 'token', type: String })
  @UseGuards(AccessJwtAuthGuard)
  @Get('gr/join')
  joinGr(
    @Query('token') token: string,
    @ATUser() user: unknown,
  ): Promise<BaseResDto> {
    console.log(`join group by magic link #${token}`);

    if (isEmpty(user?.['userInfo']?.['_id'])) {
      throw new UnauthorizedException();
    }

    return this.pkgMgmtService.joinGr(user['userInfo']['_id'], token);
  }

  @Get('gr/:id')
  @ApiOkResponse({ description: 'Get group by Id', type: GetGrResDto })
  @ApiParam({ name: 'id', type: String })
  getGrById(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetGrResDto> {
    console.log(`Get group #${id}`);
    return this.pkgMgmtService.getGrById(id);
  }

  @Delete('gr/:id')
  @ApiOkResponse({ description: 'Deleted Group', type: BaseResDto })
  @ApiParam({ name: 'id', type: String })
  deleteGr(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Delete group #${id}`);
    return this.pkgMgmtService.deleteGr(id);
  }

  @Patch('gr/:id')
  @ApiOkResponse({ description: 'Restore deleted group', type: BaseResDto })
  @ApiParam({ name: 'id', type: String })
  restoreGr(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Delete group #${id}`);
    return this.pkgMgmtService.restoreGr(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put('gr/:id')
  @ApiOkResponse({ description: `Updated Group's name`, type: BaseResDto })
  updateGr(
    @Param('id') id: string,
    @Body() updateGrReqDto: UpdateGrReqDto,
  ): Promise<BaseResDto> {
    console.log(`update package #${id}`, updateGrReqDto);
    updateGrReqDto._id = id;
    return this.pkgMgmtService.updateGr(updateGrReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put('gr/:id/memb')
  @ApiOkResponse({
    description: `Added new member to group`,
    type: BaseResDto,
  })
  addGrMemb(
    @Param('id') id: string,
    @Body() updateGrMbReqDto: AddGrMbReqDto,
  ): Promise<BaseResDto> {
    console.log(`add new member to group #${id}`, updateGrMbReqDto);
    updateGrMbReqDto._id = id;
    return this.pkgMgmtService.addGrMemb(updateGrMbReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('gr/:id/avatar')
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<BaseResDto> {
    console.log(`update user #${id}`, updateAvatarReqDto);
    updateAvatarReqDto._id = id;
    return this.pkgMgmtService.updateAvatar(updateAvatarReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('gr/:id/channel')
  updateChannel(
    @Param('id') id: string,
    @Body() updateChannelReqDto: UpdateChannelReqDto,
  ): Promise<BaseResDto> {
    console.log(`update channel group #${id}`, updateChannelReqDto);
    updateChannelReqDto._id = id;
    return this.pkgMgmtService.updateChannel(updateChannelReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('gr/:id/activate')
  activateGrPkg(
    @ATUser() user: unknown,
    @Param('id') id: string,
    @Body() activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<BaseResDto> {
    console.log(
      `activate package #${activateGrPkgReqDto.package._id} in  group #${id}`,
    );
    activateGrPkgReqDto._id = id;
    activateGrPkgReqDto.user = user?.['userInfo']?.['_id'];
    return this.pkgMgmtService.activateGrPkg(activateGrPkgReqDto);
  }

  @Delete('gr/:id/memb')
  rmGrMemb(
    @Param('id') id: string,
    @Body() updateGrMbReqDto: RmGrMbReqDto,
  ): Promise<BaseResDto> {
    console.log(`remove member from group #${id}`, updateGrMbReqDto);
    updateGrMbReqDto._id = id;
    return this.pkgMgmtService.rmGrMemb(updateGrMbReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put('gr/:id/pkg')
  @ApiOperation({ description: 'Renewed/upgraded package' })
  @ApiOkResponse({
    description: `Renewed/upgraded package in group`,
    type: BaseResDto,
  })
  addGrPkg(
    @ATUser() user: unknown,
    @Param('id') id: string,
    @Body() updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<BaseResDto> {
    console.log(
      `Renew/upgrade package #${updateGrPkgReqDto.package._id} in group #${id}`,
      updateGrPkgReqDto,
    );
    updateGrPkgReqDto._id = id;
    updateGrPkgReqDto.user = user?.['userInfo']?.['_id'];
    return this.pkgMgmtService.addGrPkg(updateGrPkgReqDto);
  }

  @Delete('gr/:id/pkg')
  @ApiOkResponse({
    description: `Remove package from group`,
    type: BaseResDto,
  })
  rmGrPkg(
    @Param('id') id: string,
    @Body() updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<BaseResDto> {
    console.log(`Remove package from group #${id}`, updateGrPkgReqDto);
    updateGrPkgReqDto._id = id;
    return this.pkgMgmtService.rmGrPkg(updateGrPkgReqDto);
  }
}
