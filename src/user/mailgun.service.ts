import { Injectable } from '@nestjs/common';
const Mailgun = require('mailgun.js')
import * as FormData from 'form-data';


@Injectable()
export class MailgunService {
  private mail: any;

  constructor() {
    const mailgun = new Mailgun(FormData);
    this.mail = mailgun.client({
      username: 'api',
      key: 'MAILGUN API PASTE HERE',
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {

    const data = {
      from: `NestJS API <mailgun@sandbox55fb4a5930d34d0592eabc24aa9ea9fc.mailgun.org>`,
      to,
      subject,
      text,
    };

    try {
      await this.mail.messages.create('sandbox55fb4a5930d34d0592eabc24aa9ea9fc.mailgun.org', data);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}: ${error.message}`);
    }
  }
}
