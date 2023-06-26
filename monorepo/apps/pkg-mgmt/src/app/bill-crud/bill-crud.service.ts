import {
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { Bill, BillDocument } from '../../schemas/billing.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseResDto,
  CreateBillReqDto,
  GetGrDto_Bill,
  GetBillResDto,
  GetBorrowerDto,
  UpdateBillReqDto,
  UpdateBillSttReqDto,
  UserDto,
  kafkaTopic,
  mapUserDtoToPopulateUserDto,
  PopulateUserDto,
} from '@nyp19vp-be/shared';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { Types } from 'mongoose';
import { GrCrudService } from '../gr-crud/gr-crud.service';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class BillCrudService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => GrCrudService))
    private readonly grCrudService: GrCrudService,
    @InjectModel(Group.name) private grModel: SoftDeleteModel<GroupDocument>,
    @InjectModel(Bill.name) private billModel: SoftDeleteModel<BillDocument>,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}
  onModuleInit() {
    this.usersClient.subscribeToResponseOf(kafkaTopic.USERS.GET_MANY);
  }
  async create(createBillReqDto: CreateBillReqDto): Promise<BaseResDto> {
    const { _id, borrowers, lender, createdBy } = createBillReqDto;
    const borrow_user = borrowers.map((user) => {
      return user.borrower;
    });
    const isU = await this.grCrudService.isGrU(
      _id,
      borrow_user.concat([lender]),
    );
    const isAuthor = await this.grCrudService.isGrU(_id, [createdBy]);
    if (!isAuthor) {
      return Promise.resolve({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'UNAUTHORIZED',
        message: `MUST be group's member to create bill`,
      });
    } else if (!isU) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'BAD REQUEST',
        message: `Lender and borrower MUST be group's members`,
      });
    } else if (borrow_user.includes(lender)) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'BAD REQUEST',
        message: `The lender MUST be different from the borrower`,
      });
    } else {
      return await Promise.all(
        borrowers.map(async (borrower) => {
          const newBorrower = {
            borrower: borrower.borrower,
            amount: borrower.amount,
            status: 'PENDING',
          };
          return newBorrower;
        }),
      ).then(async (listBorrowers) => {
        const newBilling = new this.billModel({
          summary: createBillReqDto.summary,
          date: createBillReqDto.date,
          lender: lender,
          borrowers: listBorrowers,
          description: createBillReqDto.description,
          createdBy: createdBy,
        });
        return await newBilling.save().then(async (newBill) => {
          return await this.grModel
            .findByIdAndUpdate(
              { _id: _id },
              { $push: { billing: newBill._id } },
            )
            .then((res) => {
              if (res) {
                return Promise.resolve({
                  statusCode: HttpStatus.CREATED,
                  message: `Created bill of group ${_id}`,
                });
              } else {
                return Promise.resolve({
                  statusCode: HttpStatus.NOT_FOUND,
                  error: 'NOT FOUND',
                  message: `Group #${_id} not found`,
                });
              }
            })
            .catch((error) => {
              return Promise.resolve({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
                error: 'INTERNAL SERVER ERROR',
              });
            });
        });
      });
    }
  }
  async get(_id: Types.ObjectId): Promise<GetBillResDto> {
    console.log(`Get billing of group #${_id}`);
    return await this.grModel
      .findOne({ _id: _id }, { billing: 1 })
      .populate({ path: 'billing', model: 'Bill' })
      .sort({ createdAt: -1 })
      .then(async (res) => {
        if (res) {
          return Promise.resolve({
            statusCode: HttpStatus.OK,
            message: `Got bill of group ${_id}`,
            billing: await this.mapBillModelToGetGrDto_Bill(res),
          });
        } else {
          return Promise.resolve({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Group #${_id} not found`,
            billing: null,
          });
        }
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
          billing: null,
        });
      });
  }
  async mapBillModelToGetGrDto_Bill(model): Promise<GetGrDto_Bill[]> {
    const result = await Promise.all(
      model.billing.map(async (bill) => {
        const list_id = bill.borrowers.map((borrower) => {
          return borrower.borrower;
        });
        list_id.push(bill.lender);
        const list_user = await firstValueFrom(
          this.usersClient
            .send(kafkaTopic.USERS.GET_MANY, list_id)
            .pipe(timeout(5000)),
        );
        const newBorrowers = [];
        for (let i = 0; i < list_user.length - 1; i++) {
          const borrow = {
            borrower: mapUserDtoToPopulateUserDto(list_user[i]),
            amount: bill.borrowers[i].amount,
            status: bill.borrowers[i].status,
          };
          newBorrowers.push(borrow);
        }
        const getGrDto_Bill: GetGrDto_Bill = {
          _id: bill._id,
          summary: bill.summary,
          date: bill.date,
          lender: mapUserDtoToPopulateUserDto(list_user[list_user.length - 1]),
          borrowers: newBorrowers,
          description: bill.description,
          createdBy: bill.createdBy,
          updatedBy: bill.updatedBy,
        };
        return getGrDto_Bill;
      }),
    );
    return result;
  }
  async update(updateBillReqDto: UpdateBillReqDto): Promise<BaseResDto> {
    const { _id, borrowers } = updateBillReqDto;
    console.log(`Update billing #${_id}`);
    const billing = await this.billModel.findById({ _id: _id });
    const borrow_user = borrowers.map((user) => {
      return user.borrower;
    });
    const isU = await this.grCrudService.isGrU(_id, borrow_user);
    if (!isU) {
      return Promise.resolve({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'BAD REQUEST',
        message: `Borrowers MUST be group's members`,
      });
    } else {
      billing.borrowers.filter((elem) => {
        if (borrowers.some((borrower) => borrower.borrower == elem.borrower)) {
          return true;
        } else {
          return false;
        }
      });
      borrowers.map((borrower) => {
        const idx = billing.borrowers.findIndex(
          (obj) => obj.borrower == borrower.borrower,
        );
        if (idx != -1) {
          billing.borrowers[idx].amount = borrower.amount;
        } else {
          billing.borrowers.push({
            borrower: borrower.borrower,
            amount: borrower.amount,
            status: 'PENDING',
          });
        }
      });
      return await this.billModel
        .findByIdAndUpdate(
          { _id: _id },
          {
            $set: {
              summary: updateBillReqDto.summary,
              date: updateBillReqDto.date,
              lender: updateBillReqDto.lender,
              description: updateBillReqDto.description,
              borrowers: billing.borrowers,
              updatedBy: updateBillReqDto.updatedBy,
            },
          },
        )
        .then(async (res) => {
          if (res) {
            const data = await this.billModel.findById({ _id: _id });
            return Promise.resolve({
              statusCode: HttpStatus.OK,
              message: `Update bill ${_id} successfully`,
              data: data,
            });
          } else {
            return Promise.resolve({
              statusCode: HttpStatus.NOT_FOUND,
              message: `Billing #${_id} not found`,
              error: 'NOT FOUND',
            });
          }
        })
        .catch((error) => {
          return Promise.resolve({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            error: 'INTERNAL SERVER ERROR',
          });
        });
    }
  }
  async updateStt(
    updateBillSttReqDto: UpdateBillSttReqDto,
  ): Promise<BaseResDto> {
    const { _id, updatedBy, borrowers } = updateBillSttReqDto;
    console.log(`Update billing status of group #${_id}`, updateBillSttReqDto);
    const billing = await this.billModel.findById({ _id: _id });
    if (updatedBy == billing.lender) {
      if (billing) {
        for (const borrower of borrowers) {
          const idx = billing.borrowers.findIndex(
            (obj) => obj.borrower == borrower.borrower,
          );
          if (idx != -1) {
            billing.borrowers[idx].status = borrower.status;
          }
        }
        return await this.billModel
          .updateOne({ _id: _id }, { $set: { borrowers: billing.borrowers } })
          .then(() => {
            return Promise.resolve({
              statusCode: HttpStatus.OK,
              message: `Update bill ${_id}' status successfully`,
              data: billing.borrowers,
            });
          })
          .catch((error) => {
            return Promise.resolve({
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
              error: 'INTERNAL SERVER ERROR',
            });
          });
      } else {
        return Promise.resolve({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Billing #${_id} not found`,
          error: 'NOT FOUND',
        });
      }
    } else {
      return Promise.resolve({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `No permission`,
        error: 'UNAUTHORIZED',
      });
    }
  }
  async remove(id: Types.ObjectId): Promise<BaseResDto> {
    console.log(`Remove billing #${id}`);
    return await this.billModel
      .deleteById(id)
      .then((res) => {
        console.log(res);
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `Remove billing ${id} successfully`,
          data: res,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
        });
      });
  }
  async restore(id: Types.ObjectId): Promise<BaseResDto> {
    console.log(`Restore billing #${id}`);
    return await this.billModel
      .restore({ _id: id })
      .then((res) => {
        console.log(res);
        return Promise.resolve({
          statusCode: HttpStatus.OK,
          message: `Restore billing ${id} successfully`,
          data: res,
        });
      })
      .catch((error) => {
        return Promise.resolve({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'INTERNAL SERVER ERROR',
        });
      });
  }
}
