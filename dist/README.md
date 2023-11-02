# Heriku

sending mail
> only works on gmail 
```js
import {Email} from "heriku"



const emailConfig = {
  service: 'Gmail', 
  auth: {
    user: 'your-email@gmail.com', 
    pass: 'app password' 
  }
};

const emailSender = new Email(emailConfig);

const emailData = {
  from: 'your-email@gmail.com', // Replace with your email address
  to: 'recipient@example.com', // Replace with the recipient's email address
  subject: 'Test Email',
  text: 'hello.',
  html: '<p><h1>hello world</h1>.</p>'
};


emailSender.sendEmail(emailData)
  .then(() => {
    console.log('Email sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });


```

## ChatGpt reply email

```ts
import {GPTMail} from "heriku"

// Your OpenAI API key
const apiKey = 'api-key';


const gptMail = new GptMail(apiKey);


const gptConfig = 'Your are a helpfull assistant';//how you want chatgpt to behave
gptMail.setGptType(gptConfig);

const emailConfig = {
  service: 'Gmail', 
  auth: {
    user: 'your-email@gmail.com', 
    pass: 'app password', 
  },
};


gptMail.gptSendReply(emailConfig)
  .then(() => {
    console.log('Emails processed and replied using GPT successfully.');
  })
  .catch((error) => {
    console.error('Error processing and replying to emails:', error);
  });




```