import { Logger } from '@nestjs/common';

import { Resend } from 'resend';
import { type SendMailOptions } from 'nodemailer';

import { type EmailDriverInterface } from 'src/engine/core-modules/email/drivers/interfaces/email-driver.interface';

export class ResendDriver implements EmailDriverInterface {
  private readonly logger = new Logger(ResendDriver.name);
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async send(sendMailOptions: SendMailOptions): Promise<void> {
    const { from, to, subject, html, text, cc, bcc, replyTo } = sendMailOptions;

    const extractAddress = (addressField: any): string[] => {
      if (!addressField) return [];
      if (Array.isArray(addressField)) {
         return addressField.map(a => typeof a === 'string' ? a : a.address).filter(Boolean);
      }
      return [typeof addressField === 'string' ? addressField : addressField.address].filter(Boolean);
    };

    const toArray = extractAddress(to);
    
    if (toArray.length === 0) {
      this.logger.error('No recipients defined for Resend email');
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: typeof from === 'string' ? from : (from?.address || 'noreply@yourdomain.com'),
        to: toArray,
        subject: subject || 'No subject',
        html: html ? html.toString() : '',
        text: text ? text.toString() : '',
        cc: cc ? extractAddress(cc) : undefined,
        bcc: bcc ? extractAddress(bcc) : undefined,
        replyTo: replyTo ? extractAddress(replyTo) : undefined,
      });

      if (error) {
        this.logger.error(`Resend API Error: ${error.message}`);
        throw new Error(error.message);
      }

      this.logger.log(`Email sent successfully via Resend. ID: ${data?.id}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email via Resend: ${err.message}`);
      throw err;
    }
  }
}
