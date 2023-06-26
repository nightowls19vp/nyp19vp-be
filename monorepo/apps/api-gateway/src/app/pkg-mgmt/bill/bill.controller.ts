import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import { BillService } from './bill.service';
import {
  BaseResDto,
  CreateBillReqDto,
  GetBillResDto,
  ParseObjectIdPipe,
  UpdateBillReqDto,
  UpdateBillSttReqDto,
} from '@nyp19vp-be/shared';
import { Types } from 'mongoose';
import { AccessJwtAuthGuard } from '../../auth/guards/jwt.guard';
import { SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME } from '../../constants/authentication';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ATUser } from '../../decorators/at-user.decorator';

@ApiTags('Package Management/Bill')
@Controller('pkg-mgmt/bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':group_id')
  create(
    @ATUser() user: unknown,
    @Param('group_id') id: string,
    @Body() createBillReqDto: CreateBillReqDto,
  ): Promise<BaseResDto> {
    console.log(`Create billing of group #${id}`, createBillReqDto);
    createBillReqDto._id = id;
    createBillReqDto.createdBy = user?.['userInfo']?.['_id'];
    return this.billService.create(createBillReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'group_id', type: String })
  @Get(':group_id')
  find(
    @Param('group_id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<GetBillResDto> {
    console.log(`Get billing of group #${id}`);
    return this.billService.find(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':billing_id')
  update(
    @Param('billing_id') id: string,
    @Body() updateBillReqDto: UpdateBillReqDto,
  ): Promise<BaseResDto> {
    console.log(`Update billing #${id}`, updateBillReqDto);
    updateBillReqDto._id = id;
    return this.billService.update(updateBillReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put(':billing_id/status')
  updateStt(
    @ATUser() user: unknown,
    @Param('billing_id') id: string,
    @Body() updateBillSttReqDto: UpdateBillSttReqDto,
  ): Promise<BaseResDto> {
    console.log(`Update billing status of group #${id}`, updateBillSttReqDto);
    updateBillSttReqDto._id = id;
    updateBillSttReqDto.updatedBy = user?.['userInfo']?.['_id'];
    return this.billService.updateStt(updateBillSttReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'billing_id', type: String })
  @Delete(':billing_id')
  remove(
    @Param('billing_id', new ParseObjectIdPipe()) billing_id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Remove billing #${billing_id}`);
    return this.billService.remove(billing_id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'billing_id', type: String })
  @Patch(':billing_id')
  restore(
    @Param('billing_id', new ParseObjectIdPipe()) billing_id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Restore billing #${billing_id}`);
    return this.billService.restore(billing_id);
  }
}
