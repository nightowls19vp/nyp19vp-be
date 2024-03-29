import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Query,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  Delete,
} from '@nestjs/common';
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
import {
  CollectionDto,
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Types } from 'mongoose';
import { GroupService } from './group.service';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../../constants/authentication';
import { AccessJwtAuthGuard } from '../../auth/guards/jwt.guard';
import { ATUser } from '../../decorators/at-user.decorator';
import { isEmpty } from 'class-validator';

@ApiTags('Package Management/Group')
@Controller('pkg-mgmt/gr')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Group', type: BaseResDto })
  create(@Body() createGrReqDto: CreateGrReqDto): Promise<BaseResDto> {
    console.log('create group', createGrReqDto);
    return this.groupService.create(createGrReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get()
  @ApiOperation({
    description:
      'Filter MUST:\n\n\t- name(Optional): {"name":{"$regex":"(?i)(<keyword>)(?-i)"}}',
  })
  @ApiOkResponse({ description: 'Get All Groups', type: GroupDto })
  find(
    @Query(new ValidationPipe(GrCollectionProperties))
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<GroupDto>> {
    console.log('Get all groups');
    return this.groupService.find(collectionDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('user_id')
  @ApiQuery({ name: 'role', enum: ['All', 'User', 'Super User'] })
  findByUser(
    @ATUser() user: unknown,
    @Query('role') role: string,
  ): Promise<GetGrsByUserResDto> {
    console.log("Get groups by user's id", user['userInfo']['_id']);
    const memberDto: MemberDto = { user: user['userInfo']['_id'], role };
    return this.groupService.findByUser(memberDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('user_id/channel')
  findChannelByUser(@ATUser() user: unknown): Promise<GetGrChannelResDto> {
    console.log("Get groups by user's id", user['userInfo']['_id']);
    const id: Types.ObjectId = new Types.ObjectId(user['userInfo']['_id']);
    return this.groupService.findChannelByUser(id);
  }

  // create a magic link to invite user to join group
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @ApiOkResponse({ description: 'Join group by magic link', type: BaseResDto })
  @UseGuards(AccessJwtAuthGuard)
  @Post('inv')
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

    return this.groupService.invToJoinGr(reqDto);
  }

  // join group by magic link
  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @ApiOkResponse({ description: 'Join group by magic link', type: BaseResDto })
  @ApiQuery({ name: 'token', type: String })
  @UseGuards(AccessJwtAuthGuard)
  @Get('join')
  join(
    @Query('token') token: string,
    @ATUser() user: unknown,
  ): Promise<BaseResDto> {
    console.log(`join group by magic link #${token}`);

    if (isEmpty(user?.['userInfo']?.['_id'])) {
      throw new UnauthorizedException();
    }

    return this.groupService.join(user['userInfo']['_id'], token);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get group by Id', type: GetGrResDto })
  @ApiParam({ name: 'id', type: String })
  findById(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetGrResDto> {
    console.log(`Get group #${id}`);
    return this.groupService.findById(id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Deleted Group', type: BaseResDto })
  @ApiParam({ name: 'id', type: String })
  remove(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Delete group #${id}`);
    return this.groupService.remove(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Restore deleted group', type: BaseResDto })
  @ApiParam({ name: 'id', type: String })
  restore(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Delete group #${id}`);
    return this.groupService.restore(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':id')
  @ApiOkResponse({ description: `Updated Group's name`, type: BaseResDto })
  update(
    @Param('id') id: string,
    @Body() updateGrReqDto: UpdateGrReqDto,
  ): Promise<BaseResDto> {
    console.log(`update package #${id}`, updateGrReqDto);
    updateGrReqDto._id = id;
    return this.groupService.update(updateGrReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':id/memb')
  @ApiOkResponse({
    description: `Added new member to group`,
    type: BaseResDto,
  })
  addMemb(
    @Param('id') id: string,
    @Body() updateGrMbReqDto: AddGrMbReqDto,
  ): Promise<BaseResDto> {
    console.log(`add new member to group #${id}`, updateGrMbReqDto);
    updateGrMbReqDto._id = id;
    return this.groupService.addMemb(updateGrMbReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/avatar')
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<BaseResDto> {
    console.log(`update user #${id}`, updateAvatarReqDto);
    updateAvatarReqDto._id = id;
    return this.groupService.updateAvatar(updateAvatarReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/channel')
  updateChannel(
    @Param('id') id: string,
    @Body() updateChannelReqDto: UpdateChannelReqDto,
  ): Promise<BaseResDto> {
    console.log(`update channel group #${id}`, updateChannelReqDto);
    updateChannelReqDto._id = id;
    return this.groupService.updateChannel(updateChannelReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/activate')
  activatePkg(
    @ATUser() user: unknown,
    @Param('id') id: string,
    @Body() activateGrPkgReqDto: ActivateGrPkgReqDto,
  ): Promise<BaseResDto> {
    console.log(
      `activate package #${activateGrPkgReqDto.package._id} in  group #${id}`,
    );
    activateGrPkgReqDto._id = id;
    activateGrPkgReqDto.user = user?.['userInfo']?.['_id'];
    return this.groupService.activatePkg(activateGrPkgReqDto);
  }

  @Delete(':id/memb')
  rmMemb(
    @Param('id') id: string,
    @Body() updateGrMbReqDto: RmGrMbReqDto,
  ): Promise<BaseResDto> {
    console.log(`remove member from group #${id}`, updateGrMbReqDto);
    updateGrMbReqDto._id = id;
    return this.groupService.rmMemb(updateGrMbReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':id/pkg')
  @ApiOperation({ description: 'Renewed/upgraded package' })
  @ApiOkResponse({
    description: `Renewed/upgraded package in group`,
    type: BaseResDto,
  })
  addPkg(
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
    return this.groupService.addPkg(updateGrPkgReqDto);
  }

  @Delete(':id/pkg')
  @ApiOkResponse({
    description: `Remove package from group`,
    type: BaseResDto,
  })
  rmPkg(
    @Param('id') id: string,
    @Body() updateGrPkgReqDto: UpdateGrPkgReqDto,
  ): Promise<BaseResDto> {
    console.log(`Remove package from group #${id}`, updateGrPkgReqDto);
    updateGrPkgReqDto._id = id;
    return this.groupService.rmPkg(updateGrPkgReqDto);
  }
}
