import * as nodemailer from 'nodemailer';
import OpenAI from 'openai';
import { simpleParser } from 'mailparser';
import Imap from 'imap';

export class GptMail {
  private apiKey: string;
  private openai: OpenAI;
  private gptc: string;

  constructor(apikey: string) {
    this.apiKey = apikey;
    this.openai = new OpenAI({
      apiKey: `${apikey}`,
    });
  }

  setGptType(m_gpt_cfg: string) {
    this.gptc = m_gpt_cfg;
  }

  async gptSendReply(emailConfig: any) {
    const transporter = nodemailer.createTransport(emailConfig);

    try {
      const emails:any = await fetchEmails(emailConfig);

      for (const email of emails) {
        const parsedEmail = await simpleParser(email);
        const content = parsedEmail.text;

        const params: OpenAI.Chat.CompletionCreateParams = {
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: this.gptc }, 
            { role: 'assistant', content: content }, 
          ],
          model: 'gpt-3.5-turbo',
        };

        const chatCompletion = await this.openai.chat.completions.create(params);

        const reply = chatCompletion.choices[0].message.content;

        await transporter.sendMail({
          from: emailConfig.auth.user, 
          to: parsedEmail.from.value[0].address,
          subject: `Re: ${parsedEmail.subject}`,
          text: reply,
        });
      }
    } catch (error) {
      console.error('Error fetching or sending emails:', error);
    }
  }
}

async function fetchEmails(emailConfig) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(emailConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          imap.end();
          reject(err);
        } else {
          const searchCriteria = ['UNSEEN'];

          imap.search(searchCriteria, (searchError, results) => {
            if (searchError) {
              imap.end();
              reject(searchError);
            } else {
              const emailMessages = [];

              const f = imap.fetch(results, { bodies: '' });

              f.on('message', (msg) => {
                let emailData = '';

                msg.on('body', (stream, info) => {
                  stream.on('data', (chunk) => {
                    emailData += chunk.toString('utf8');
                  });
                });

                msg.on('end', () => {
                  emailMessages.push(emailData);
                });
              });

              f.on('end', () => {
                imap.end();
                resolve(emailMessages);
              });
            }
          });
        }
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}
