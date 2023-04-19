import nodemailer from 'nodemailer';
import { createTransport } from "nodemailer"

export const sendMail = async (email,subject,text)=>{
    let transporter = await nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
    })
    
    await transporter.sendMail({
        from: '"Devesh Sharma" <dev@gmail.com>',
        to: email,
        subject,
        text,
    })
}