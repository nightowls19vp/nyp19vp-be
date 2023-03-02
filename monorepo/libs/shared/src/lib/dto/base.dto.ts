export class BaseResDto {
  status: 'success' | 'fail';
  msg: string;
  data: object;
}
