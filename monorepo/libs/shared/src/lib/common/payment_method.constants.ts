import * as kafkaTopic from './topics.kafka';

export const PAYMENT_METHOD = {
  EWALLET: 'Digital Wallet',
  TRANSFER: 'Bank Transfer',
  PLAYSTORE: 'Play Store',
};

export const EWALLET = {
  ZALOPAY: 'ZaloPay',
  VNPAY: 'VnPay',
  MOMO: 'MoMo',
};

export const KEY = {
  EWALLET: {
    ZALOPAY: kafkaTopic.TXN.ZP_CREATE_ORD,
    VNPAY: kafkaTopic.TXN.VNP_CREATE_ORD,
  },
};

export const ZALOPAY = {
  36: 'Visa/Master/JCB',
  37: 'Bank Account',
  38: 'ZaloPay Wallet',
  39: 'ATM',
  41: 'Visa/Master Debit',
};
