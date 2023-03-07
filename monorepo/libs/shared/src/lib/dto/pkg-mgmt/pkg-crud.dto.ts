import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { BaseResDto } from '../base.dto';

export class CreatePkgReqDto {
    id: string;
    
    @ApiProperty({
      minLength: 3,
      maxLength: 30,
      nullable: false,
      required: true
    })
    @IsString()
    name: string;
  
    @ApiProperty({
        minimum: 30,
        description: 'Unit: day',
        required: true
    })
    @IsNumber()
    duration: number 

    @ApiProperty({
        minimum: 3,
        required: true
    })
    @IsNumber()
    price: Number

    @ApiProperty({
        minimum: 1,
        required: true
    })
    @IsInt()
    noOfMember: number

    @ApiProperty()
    description: string
}

export class CreatePkgResDto extends BaseResDto {}

export class UpdatePkgReqDto extends PartialType(CreatePkgReqDto) {}

export class UpdatePkgResDto extends BaseResDto {}


