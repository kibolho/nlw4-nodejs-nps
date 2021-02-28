import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

class SendMailService {
  private client: Transporter;
  constructor() {
    // create reusable transporter object using the default SMTP transport
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass, // generated ethereal password
        },
      });
      this.client = transporter;
    });
  }
  async execute(
    to: string,
    subject: string,
    variables: object,
    templatePath: string,
  ): Promise<{ mailUrl: string }> {
    const templateFileContent = fs.readFileSync(templatePath).toString('utf8');

    const mailTemplateParse = handlebars.compile(templateFileContent);
    const html = mailTemplateParse(variables);
    console.log("this.client",this.client);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <noreply@nps.com.br',
    });
    console.log('Message sent: %s', message.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    return { mailUrl: nodemailer.getTestMessageUrl(message) };
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
}

export default new SendMailService();
