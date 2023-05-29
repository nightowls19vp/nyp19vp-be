import { BaseResDto } from '../../base.dto';

export class GroupDto {
  id?: string;
  groupMongoId: string;
  packageMongoId: string;
}

export class PkgMgmtInitReqDto extends GroupDto {}

export class PkgMgmtInitResDto extends BaseResDto {}
