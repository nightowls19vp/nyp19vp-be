import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CheckoutReqDto,
  CreateUserReqDto,
  CreateUserResDto,
  GetCartResDto,
  GetUserInfoResDto,
  GetUserSettingResDto,
  kafkaTopic,
  ParseObjectIdPipe,
  RenewGrPkgReqDto,
  UpdateAvatarReqDto,
  UpdateAvatarResDto,
  UpdateCartReqDto,
  UpdateCartResDto,
  UpdateSettingReqDto,
  UpdateSettingResDto,
  UpdateUserReqDto,
  UpdateUserResDto,
  UserDto,
  UsersCollectionProperties,
  VNPCreateOrderResDto,
  ZPCheckoutResDto,
} from '@nyp19vp-be/shared';
import { ClientKafka } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common/interfaces';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Ip, Patch, Query } from '@nestjs/common/decorators';
import {
  CollectionDto,
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Types } from 'mongoose';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../constants/authentication';
import { AccessJwtAuthGuard } from '../auth/guards/jwt.guard';
import { ATUser } from '../decorators/at-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(kafkaTopic.HEALT_CHECK.USERS);
    for (const key in kafkaTopic.USERS) {
      this.usersClient.subscribeToResponseOf(kafkaTopic.USERS[key]);
    }
    await Promise.all([this.usersClient.connect()]);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created user', type: CreateUserResDto })
  @ApiInternalServerErrorResponse({ description: 'Bad Request: Duplicate Key' })
  async create(
    @Body() createUserReqDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    console.log('createUser', createUserReqDto);
    return this.usersService.createUser(createUserReqDto);
  }

  @Get()
  @ApiOperation({
    description:
      'Filter MUST: \n\n\t- name(optional): {"name":{"$regex":"(?i)(<keyword>)(?-i)"}}\n\n\t- phone(optional)\n\n\t\t+ check input @IsPhoneNumber(\'VI\')\n\n\t\t+ search full-text\n\n\t\t+ example: {"phone":"+84987654321"}\n\n\t- email(optional)\n\n\t\t+ check input exists @\n\n\t\t+ example: {"email":{"$regex":"^exam@"}}',
  })
  @ApiOkResponse({ description: 'Got All Users' })
  async getAll(
    @Query(new ValidationPipe(UsersCollectionProperties))
    collectionDto: CollectionDto,
  ): Promise<CollectionResponse<UserDto>> {
    console.log('get all users');
    console.log(collectionDto.filter);
    return this.usersService.getAllUsers(collectionDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get('search')
  async searchUser(@Query('keyword') keyword: string): Promise<UserDto[]> {
    console.log('search users');
    return this.usersService.searchUser(keyword);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'Got user by Id', type: GetUserInfoResDto })
  @ApiParam({ name: 'id', type: String })
  @ApiNotFoundResponse({ description: 'No user found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getUserById(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetUserInfoResDto> {
    console.log(`get user info by #${id}`);
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get(':id/setting')
  @ApiOkResponse({
    description: 'Got User Setting by Id',
    type: GetUserSettingResDto,
  })
  @ApiParam({ name: 'id', type: String })
  async getUserSettingById(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetUserSettingResDto> {
    console.log(`get user setting #${id}`);
    return this.usersService.getUserSettingById(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Get(':id/cart')
  @ApiOkResponse({ description: 'Got shopping cart', type: GetCartResDto })
  @ApiParam({ name: 'id', type: String })
  async getCart(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetCartResDto> {
    console.log(`get items of user #${id}'s cart`);
    return this.usersService.getCart(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Deleted user', type: CreateUserResDto })
  async deleteUser(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<CreateUserResDto> {
    console.log(`delete user #${id}`);
    return this.usersService.deleteUser(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Patch(':id/restore')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Restore deleted user',
    type: CreateUserResDto,
  })
  async restoreUser(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<CreateUserResDto> {
    console.log(`restore user #${id}`);
    return this.usersService.restoreUser(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':id')
  @ApiOkResponse({ description: 'Updated User', type: UpdateUserResDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserReqDto: UpdateUserReqDto,
  ): Promise<UpdateUserResDto> {
    console.log(`update user #${id}`, updateUserReqDto);
    updateUserReqDto._id = id;
    return this.usersService.updateUser(updateUserReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':id/setting')
  @ApiOkResponse({
    description: 'Updated User Setting',
    type: UpdateSettingResDto,
  })
  async updateSetting(
    @Param('id') id: string,
    @Body() updateSettingReqDto: UpdateSettingReqDto,
  ): Promise<UpdateSettingResDto> {
    console.log(`update user #${id}`, updateSettingReqDto);
    updateSettingReqDto._id = id;
    return this.usersService.updateSetting(updateSettingReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/avatar')
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarReqDto: UpdateAvatarReqDto,
  ): Promise<UpdateAvatarResDto> {
    console.log(`update user #${id}`, updateAvatarReqDto);
    updateAvatarReqDto._id = id;
    return this.usersService.updateAvatar(updateAvatarReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':id/cart')
  @ApiOkResponse({
    description: "Updated user's shopping cart",
    type: UpdateCartResDto,
  })
  @ApiOperation({
    description:
      'Update all items in cart.\n\nMUST update the entire cart, not add or remove a few items.',
  })
  async updateCart(
    @Param('id') id: string,
    @Body() updateCartReqDto: UpdateCartReqDto,
  ): Promise<UpdateCartResDto> {
    console.log(`update items of user #${id}'s cart`, updateCartReqDto);
    updateCartReqDto._id = id;
    return this.usersService.updateCart(updateCartReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('checkout')
  async checkout(
    @ATUser() user: unknown,
    @Body() checkoutReqDto: CheckoutReqDto,
    @Ip() ip: string,
  ): Promise<ZPCheckoutResDto | VNPCreateOrderResDto> {
    const _id = user?.['userInfo']?.['_id'];
    console.log(`checkout #${_id}`, checkoutReqDto);
    if (ip == '::1') ip = '127.0.0.1';
    checkoutReqDto._id = _id;
    checkoutReqDto.ipAddr = ip;
    return this.usersService.checkout(checkoutReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post('renew/:grId')
  async renewPkg(
    @ATUser() user: unknown,
    @Param('grId') grId: string,
    @Body() renewGrPkgReqDto: RenewGrPkgReqDto,
    @Ip() ip: string,
  ): Promise<ZPCheckoutResDto | VNPCreateOrderResDto> {
    const _id = user?.['userInfo']?.['_id'];
    console.log(`renew package in group #${_id}`, renewGrPkgReqDto);
    renewGrPkgReqDto._id = _id;
    renewGrPkgReqDto.ipAddr = ip;
    return this.usersService.renewPkg(renewGrPkgReqDto);
  }

  @Get('healthcheck')
  async healthcheck() {
    // const res = await firstValueFrom(
    //   this.usersClient.send(kafkaTopic.HEALT_CHECK.USERS, {})
    // );
    // return res;
  }
}
