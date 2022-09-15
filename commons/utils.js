import fs from 'fs';
import {logger} from '../logger.js'
import nodemailer from 'nodemailer'


export function saveFile(baseImage, filename, dir) {
  logger.info('-->>>> Uploading File');
  const localPath = `uploads/${dir}/`;
  
  const ext = baseImage.substring(baseImage.indexOf('/') + 1, baseImage.indexOf(';base64'));
  const fileType = baseImage.substring('data:'.length, baseImage.indexOf('/'));
  
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
  
  const base64Data = baseImage.replace(regex, '');
    // Check that if directory is present or not.
    const directories = localPath.split('/');
    let checkPath = '';
    for (const path of directories) {
        checkPath += path + '/';
        if (!fs.existsSync(checkPath)) {
            fs.mkdirSync(checkPath);
        }
    }
    console.log('>>> Path confirm: ', localPath);


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

        console.log(info);
        resolve(true)
    })
  
  })
}



