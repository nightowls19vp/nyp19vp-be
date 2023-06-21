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
@Controller('pkg-mgmt/gr')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Post(':id/bill')
  createBill(
    @ATUser() user: unknown,
    @Param('id') id: string,
    @Body() createBillReqDto: CreateBillReqDto,
  ): Promise<BaseResDto> {
    console.log(`Create billing of group #${id}`, createBillReqDto);
    createBillReqDto._id = id;
    createBillReqDto.createdBy = user?.['userInfo']?.['_id'];
    return this.billService.createBill(createBillReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'id', type: String })
  @Get(':id/bill')
  getBill(
    @Param('id', new ParseObjectIdPipe()) id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Get billing of group #${id}`);
    return this.billService.getBill(id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put('bill/:billing_id')
  updateBill(
    @Param('billing_id') id: string,
    @Body() updateBillReqDto: UpdateBillReqDto,
  ): Promise<BaseResDto> {
    console.log(`Update billing #${id}`, updateBillReqDto);
    updateBillReqDto._id = id;
    return this.billService.updateBill(updateBillReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @Put('bill/:billing_id/status')
  updateBillStt(
    @ATUser() user: unknown,
    @Param('billing_id') id: string,
    @Body() updateBillSttReqDto: UpdateBillSttReqDto,
  ): Promise<BaseResDto> {
    console.log(`Update billing status of group #${id}`, updateBillSttReqDto);
    updateBillSttReqDto._id = id;
    updateBillSttReqDto.updatedBy = user?.['userInfo']?.['_id'];
    return this.billService.updateBillStt(updateBillSttReqDto);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'billing_id', type: String })
  @Delete('bill/:billing_id')
  rmBill(
    @Param('billing_id', new ParseObjectIdPipe()) billing_id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Remove billing #${billing_id}`);
    return this.billService.rmBill(billing_id);
  }

  @ApiBearerAuth(SWAGGER_BEARER_AUTH_ACCESS_TOKEN_NAME)
  @UseGuards(AccessJwtAuthGuard)
  @ApiParam({ name: 'billing_id', type: String })
  @Patch('bill/:billing_id')
  restoreBill(
    @Param('billing_id', new ParseObjectIdPipe()) billing_id: Types.ObjectId,
  ): Promise<BaseResDto> {
    console.log(`Restore billing #${billing_id}`);
    return this.billService.restoreBill(billing_id);
  }
}
