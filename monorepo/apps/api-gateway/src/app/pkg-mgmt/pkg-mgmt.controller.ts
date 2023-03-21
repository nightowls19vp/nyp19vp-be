import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  OnModuleInit,
  Inject,
  Req,
  Put,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  UpdateGrMbReqDto,
  UpdateGrMbResDto,
  CreateGrReqDto,
  CreateGrResDto,
  CreatePkgReqDto,
  CreatePkgResDto,
  GetGrResDto,
  GetGrsResDto,
  GetPkgResDto,
  GetPkgsResDto,
  kafkaTopic,
  UpdateGrReqDto,
  UpdateGrResDto,
  UpdatePkgReqDto,
  UpdatePkgResDto,
  UpdateGrPkgReqDto,
  UpdateGrPkgResDto,
} from '@nyp19vp-be/shared';
import { PkgMgmtService } from './pkg-mgmt.service';

@Controller('pkg-mgmt')
export class PkgMgmtController implements OnModuleInit {
  constructor(
    private readonly pkgMgmtService: PkgMgmtService,
    @Inject('PKG_MGMT_SERVICE') private readonly packageMgmtClient: ClientKafka
  ) {}
  async onModuleInit() {
    this.packageMgmtClient.subscribeToResponseOf(
      kafkaTopic.HEALT_CHECK.PACKAGE_MGMT
    );

    for (const key in kafkaTopic.PACKAGE_MGMT) {
      this.packageMgmtClient.subscribeToResponseOf(
        kafkaTopic.PACKAGE_MGMT[key]
      );
    }

    await Promise.all([this.packageMgmtClient.connect()]);
  }

  @Post('pkg')
  @ApiTags('Package Management')
  @ApiCreatedResponse({ description: 'Created Package', type: CreatePkgResDto })
  createPkg(
    @Body() createPkgReqDto: CreatePkgReqDto
  ): Promise<CreatePkgResDto> {
    console.log('createPkg', createPkgReqDto);
    return this.pkgMgmtService.createPkg(createPkgReqDto);
  }

  @Get('pkg')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Got All Packages', type: GetPkgsResDto })
  getAllPkg(@Req() req: Request): Promise<GetPkgsResDto> {
    console.log('get all packages');
    return this.pkgMgmtService.getAllPkg(req);
  }

  @Get('pkg/:id')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Got All Packages', type: GetPkgResDto })
  getPkgById(@Param('id') id: string): Promise<GetPkgResDto> {
    console.log(`get package #${id}`);
    return this.pkgMgmtService.getPkgById(id);
  }

  @Patch('pkg/:id')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Updated Package', type: CreatePkgResDto })
  deletePkg(@Param('id') id: string): Promise<CreatePkgResDto> {
    console.log(`delete package #${id}`);
    return this.pkgMgmtService.deletePkg(id);
  }

  @Put('pkg/:id')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Updated Package', type: UpdatePkgResDto })
  updatePkg(
    @Param('id') id: string,
    @Body() updatePkgReqDto: UpdatePkgReqDto
  ): Promise<UpdatePkgResDto> {
    console.log(`update package #${id}`, updatePkgReqDto);
    updatePkgReqDto._id = id;
    return this.pkgMgmtService.updatePkg(updatePkgReqDto);
  }

  @Post('gr')
  @ApiTags('Package Management')
  @ApiCreatedResponse({ description: 'Created Group', type: CreateGrResDto })
  createGr(@Body() createGrReqDto: CreateGrReqDto): Promise<CreateGrResDto> {
    console.log('create group', createGrReqDto);
    return this.pkgMgmtService.createGr(createGrReqDto);
  }

  @Get('gr')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Get All Groups', type: GetGrsResDto })
  getAllGr(@Req() req: Request): Promise<GetGrsResDto> {
    console.log('Get all groups');
    return this.pkgMgmtService.getAllGr(req);
  }

  @Get('gr/:id')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Get All Groups', type: GetGrResDto })
  getGrById(@Param('id') id: string): Promise<GetGrResDto> {
    console.log(`Get group #${id}`);
    return this.pkgMgmtService.getGrById(id);
  }

  @Patch('gr/:id')
  @ApiTags('Package Management')
  @ApiOkResponse({ description: 'Delete Group', type: CreateGrResDto })
  deleteGr(@Param('id') id: string): Promise<CreateGrResDto> {
    console.log(`Delete group #${id}`);
    return this.pkgMgmtService.deleteGr(id);
  }

  @Put('gr/:id')
  @ApiTags('Package Management')
  @ApiOkResponse({
    description: `Updated Group's name`,
    type: UpdateGrResDto,
  })
  updateGr(
    @Param('id') id: string,
    @Body() updateGrReqDto: UpdateGrReqDto
  ): Promise<UpdateGrResDto> {
    console.log(`update package #${id}`, updateGrReqDto);
    updateGrReqDto._id = id;
    return this.pkgMgmtService.updateGr(updateGrReqDto);
  }

  @Put('gr/:id/memb')
  @ApiTags('Package Management')
  @ApiOkResponse({
    description: `Added new member to group`,
    type: UpdateGrMbResDto,
  })
  addGrMemb(
    @Param('id') id: string,
    @Body() updateGrMbReqDto: UpdateGrMbReqDto
  ): Promise<UpdateGrMbResDto> {
    console.log(`add new member to group #${id}`, updateGrMbReqDto);
    updateGrMbReqDto._id = id;
    return this.pkgMgmtService.addGrMemb(updateGrMbReqDto);
  }

  @Put('gr/:id/memb/rm')
  @ApiTags('Package Management')
  @ApiOkResponse({
    description: `Removed member from group`,
    type: UpdatePkgResDto,
  })
  rmGrMemb(
    @Param('id') id: string,
    @Body() updateGrMbReqDto: UpdateGrMbReqDto
  ): Promise<UpdateGrMbResDto> {
    console.log(`remove member from group #${id}`, updateGrMbReqDto);
    updateGrMbReqDto._id = id;
    return this.pkgMgmtService.rmGrMemb(updateGrMbReqDto);
  }

  @Put('gr/:id/pkg')
  @ApiTags('Package Management')
  @ApiOkResponse({
    description: `Added new package to group`,
    type: UpdatePkgResDto,
  })
  addGrPkg(
    @Param('id') id: string,
    @Body() updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    console.log(`add new member to group #${id}`, updateGrPkgReqDto);
    updateGrPkgReqDto._id = id;
    return this.pkgMgmtService.addGrPkg(updateGrPkgReqDto);
  }

  @Put('gr/:id/pkg/rm')
  @ApiTags('Package Management')
  @ApiOkResponse({
    description: `Remove package from group`,
    type: UpdatePkgResDto,
  })
  rmGrPkg(
    @Param('id') id: string,
    @Body() updateGrPkgReqDto: UpdateGrPkgReqDto
  ): Promise<UpdateGrPkgResDto> {
    console.log(`Remove package from group #${id}`, updateGrPkgReqDto);
    updateGrPkgReqDto._id = id;
    return this.pkgMgmtService.rmGrPkg(updateGrPkgReqDto);
  }
}
