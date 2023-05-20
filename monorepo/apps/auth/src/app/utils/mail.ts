import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';

export const sendMailWithRetries = async (
  mailService: MailerService,
  opt: ISendMailOptions,
  retries = 10,
): Promise<boolean | unknown> => {
  console.log('sendMail ' + retries, JSON.stringify(opt));

  if (retries <= 0) {
    console.error('sendMail  FAILED');

    return false;
  }
  try {
    return mailService.sendMail(opt);
  } catch (error) {
    console.error('sendMail error', error);

    retries--;
    return sendMailWithRetries(mailService, opt, retries);
  }
};
