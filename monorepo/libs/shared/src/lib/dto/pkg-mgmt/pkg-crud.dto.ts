import { OmitType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsPositive, IsEnum, ValidateNested, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { BaseResDto } from '../base.dto';

export class CreatePkgReqDto{
    id: string

    @ApiProperty({
        type: String,
        minLength: 3,
        maxLength: 30,
        uniqueItems: true,
        nullable: false,
        required: true
    })
    @IsString()
    name: string

    @ApiProperty({
        type: Number,
        minimum: 30,
        required: true
    })
    @IsInt()
    @IsPositive()
    duration: number

    @ApiProperty({
        required: true
    })
    @IsPositive()
    price: number

    @ApiProperty({
        required: true
    })
    @IsInt()
    @IsPositive()
    noOfMember: number

    @ApiProperty({
        type: String,
        minLength: 3,
        maxLength: 1000,
        nullable: true
    })
    @IsString()
    description: string
}

export class CreatePkgResDto extends BaseResDto {}

export class UpdatePkgReqDto extends OmitType(CreatePkgReqDto, ['name'] as const) {}

export class UpdatePkgResDto extends BaseResDto {}

export class CreateGrPkgReqDto {
    id: string

    @ApiProperty({
        required: true
    })
    @Type(() => CreatePkgReqDto)
    @ValidateNested()
    package: CreatePkgReqDto

    @ApiProperty({
        type: Date,
        required: true
    })
    startedAt: Date

    @ApiProperty({
        type: Date,
        required: true
    })
    endAt: Date

    @ApiProperty({
        required: true
    })
    @IsEnum(['Active', 'Expired', 'Not Activated'])
    state: SwaggerEnumType
}

export class CreateGrPkgResDto extends BaseResDto {}

export class CreateGrReqDto {
    id: string

    @ApiProperty({
        type: String,
        minLength: 3,
        maxLength: 30,
        uniqueItems: true,
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        maxLength: 8,
        nullable: false,
        required: true
    })
    @IsString()
    admin: string

    @ApiProperty({
        required: true
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    members: string[]

    @ApiProperty({
        required: true
    })
    @ValidateNested()
    @Type(() => CreatePkgReqDto)
    curPkg: CreatePkgReqDto

    @ApiProperty({
        required: true
    })
    @ValidateNested({
        each: true
    })
    @Type(() => CreatePkgReqDto)
    @ArrayUnique()
    @IsArray()
    @ArrayNotEmpty()
    listPkg: Array<CreatePkgReqDto>
}

export class CreateGrResDto extends BaseResDto {}

export class UpdateGrNameReqDto extends PickType(CreateGrReqDto, ['name']){} 

export class UpdateGrNameResDto extends BaseResDto {}

export class InviteMemberReqDto extends PickType(CreateGrReqDto, ['members']) {}

export class InviteMemberResDto extends BaseResDto {}