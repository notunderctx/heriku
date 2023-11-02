import * as nodemailer from "nodemailer";
export declare class Email {
    private transporter;
    constructor(config: any);
    sendEmail(emailData: nodemailer.SendMailOptions): Promise<void>;
}
