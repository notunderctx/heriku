import * as nodemailer from "nodemailer";


export class Email {
  private transporter: nodemailer.Transporter; 

  constructor(config:any) {
    
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(emailData: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(emailData); 
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}