import fs from 'fs';
import {logger} from '../commons/logger.js'
import nodemailer from 'nodemailer'
import twilio from 'twilio'


export function saveFile(baseImage, filename, dir) {
  logger.info('-->>>> Uploading File');
  const localPath = `uploads/${dir}/`;
  
  const ext = baseImage.substring(baseImage.indexOf('/') + 1, baseImage.indexOf(';base64'));
  const fileType = baseImage.substring('data:'.length, baseImage.indexOf('/'));
  
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
  
  const base64Data = baseImage.replace(regex, '');
  
  //   // Check that if directory is present or not.
  //   const directories = localPath.split('/');
  //   let checkPath = '';
  //   for (const path of directories) {
  //       checkPath += path + '/';
  //       if (!fs.existsSync(checkPath)) {
  //           fs.mkdirSync(checkPath);
  //       }
  //   }
  //   console.log('>>> Path confirm: ', localPath);


  const filepath = `${localPath}${filename}.${ext}`;
  fs.writeFileSync(filepath, base64Data, 'base64');

  logger.info('>>> File Uploaded: ', `${filename}.${ext}`);
  logger.info('------->>>');
  return filepath;
}


export async function asyncSendMail(asunto,mensaje,to,attac) {
  return new Promise((resolve, reject) => {
    
    logger.info(">> Envio de mail to ", to)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_MAIL,
        pass: process.env.ADMIN_MAIL_PASS,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: to || process.env.ADMIN_MAIL,
        subject: asunto,
        html: mensaje,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            logger.info(">> Mail Error: ", err);
            resolve(false);
        }
        resolve(true)
    })
  
  })
}


export async function asyncSendText(to, message, whatsapp) {
  return new Promise((resolve, reject)=> {

    logger.info(`>> Envio de ${whatsapp ? 'whatsapp ':'txt '} to `, to)

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    
    client.messages
      .create({
         body: message,
         from: (whatsapp ? 'whatsapp:+14155238886':'+16815400179'),
         to: (whatsapp?'whatsapp:+549' : '+54') +to,
       })
      .then(message => {
        console.log(message.sid);
        resolve(message);
      })
      .catch((e) => {
        logger.error('>>> error con el sms', e)
        resolve(null)
      });

  })
}



