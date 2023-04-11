import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl } from 'class-validator';

export class ItemDto {
  @ApiProperty({
    description: 'Package ID',
    type: String,
    example: '640ac2ccf227ec441cd97d7b',
  })
  id: string;

  @ApiProperty({
    description: 'Package name',
    type: String,
    example: 'Package No.1',
  })
  name: string;

  @ApiProperty({
    description:
      '- Unit price of a package;\n\n- Default currency: VND;\n\n- Example: 10000 => 10',
    type: Number,
    minimum: 10,
    example: 10,
  })
  price: number;

  @ApiProperty({
    description: 'Quantity of package',
    type: Number,
    minimum: 1,
    example: 1,
  })
  quantity: number;
}

class EmbedData {
  @ApiProperty({
    type: URL,
    default: 'https://docs.zalopay.vn/result',
    example: 'https://docs.zalopay.vn/result',
    description:
      'Redirect to this url after successful / failure payment via ZaloPay Gateway',
  })
  @IsUrl()
  @IsOptional()
  redirecturl?: string;

  @ApiProperty({
    type: JSON,
    example: { campaigncode: 'code' },
    description: 'Use to launch promotions campaign',
  })
  @IsOptional()
  @IsJSON()
  promotioninfo?: string;

  @ApiProperty({
    description:
      '-Payment information\n\n-Only needed when you need to receive money for different accounts.\n\n-ZaloPay system will generate a Payment code (corresponding to each partner bank account provided) and send it back to the partner to set up.',
  })
  @IsOptional()
  zlppaymentid?: string;
}

export class ZPCreateOrderReqDto {
  @ApiProperty({
    description: 'The amount of the order (VND)',
    required: true,
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description:
      'Identification of the application that was provided by ZaloPay.',
    example: 2553,
    required: true,
  })
  app_id: string;

  @ApiProperty({
    type: Number,
    description:
      "The time of order creation, which calculated in milliseconds, and couldn't over 15 minutes from the time of payment",
    required: true,
  })
  app_time: number;

  @ApiProperty({
    maxLength: 40,
    description:
      "Order's transaction code. Order's transaction code. Must be preceded by yymmdd of the current date. ",
  })
  app_trans_id: string;

  @ApiProperty({
    maxLength: 50,
    description:
      'Identification information of the application user. Ex: UserId',
  })
  app_user: string;

  @ApiProperty({
    description:
      "\t- Empty(''): List of payment methods and banks supported (CC, ATM, zalopayapp, ...)\n\n\t- zalopayapp: QR code to scan with ZaloPay App.\n\n\t- CC: Form to input credit card information.\n\n\t- ATM bank code (VTB, VCB, ...): Form to input bank card information",
    default: '',
    maxLength: 20,
  })
  bank_code: string;

  @ApiProperty({
    maxLength: 256,
    description:
      'The description of the order, used to display to users on the ZaloPay app',
  })
  description: string;

  @ApiProperty({
    description:
      "Application's own data. This will be returned to AppServer upon successful payment (Callback). If not, then leave the empty string",
  })
  embed_data: string;

  @ApiProperty({
    description: "Order's item",
    required: true,
  })
  item: string;

  @ApiProperty({
    description: 'Authentication information of the order',
  })
  mac: string;
}

export class ZPCreateOrderResDto {
  @ApiProperty({
    type: Number,
    enum: [1, 2],
    required: true,
    description: '1: Success\n\n2: Failure',
  })
  @IsEnum([1, 2])
  return_code: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Description of status code',
  })
  @IsString()
  return_message: string;

  @ApiProperty({
    description: 'Status code detail',
  })
  sub_return_code: number;

  @ApiProperty({
    description: 'Detail description of status code',
  })
  sub_return_message: string;

  @ApiProperty({
    type: URL,
    description:
      'Used to create QR code or forward users to ZaloPay Gateway page',
  })
  @IsUrl()
  order_url: string;

  @ApiProperty({ description: 'Transaction token' })
  zp_trans_token: string;
}

export class ZPDataCallback extends PickType(ZPCreateOrderReqDto, [
  'app_id',
  'app_trans_id',
  'app_time',
  'app_user',
  'amount',
  'embed_data',
  'item',
]) {
  @ApiProperty({
    description: "ZaloPay's Transaction code",
  })
  zp_trans_id: number;

  @ApiProperty({
    description:
      "ZaloPay's Transaction trading time (unix timestamp in milliseconds)",
  })
  server_time: number;

  @ApiProperty({
    enum: [36, 37, 38, 39, 40, 41],
    description:
      'Payment channel:\n\n\t- 36: Visa/Master/JCB\n\n\t- 37: Bank Account\n\n\t- 38: ZaloPay Wallet\n\n\t- 39: ATM\n\n\t- 41: Visa/Master Debit',
  })
  @IsEnum([36, 37, 38, 39, 40, 41])
  channel: number;

  @ApiProperty({
    description: 'ZaloPay user, who paid for the order',
  })
  merchant_user_id: string;

  @ApiProperty({
    description: 'Fee (VND)',
  })
  user_fee_amount: number;

  @ApiProperty({
    description: 'Discount(VND)',
  })
  discount_amount: number;
}

export class ZPCallbackReqDto {
  @ApiProperty({
    type: JSON,
    description: 'ZaloPay transaction data callback to the application',
  })
  data: string;

  @ApiProperty({
    type: String,
    description:
      'Confirmation of order information, using key2 (had been provided) to verify the order',
  })
  mac: string;

  @ApiProperty({
    description: 'Callback type\n\n\t- 1: Order\n\n\t- 2: Agreement',
  })
  type: number;
}

export class ZPCallbackResDto extends PickType(ZPCreateOrderResDto, [
  'return_message',
]) {
  @ApiProperty({
    description:
      '\t- 1: Success\n\n\t- 2: ZaloPay zptransid or apptransid is duplicated\n\n\t- <>: failure (not callback again)',
  })
  @IsEnum([1, 2, null])
  return_code: number;
}
