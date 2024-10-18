import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';

import { config } from '../utils/config.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sendEmailNotification = async (receiverEmailAdrress, emailSubject, htmlTemplate) => {
    const transporter = nodemailer.createTransport({
        // host: 'smtp.mail.com',
        host: 'smtp.gmail.com',
        // port: 465,
        // secure: true,
        auth: {
            user: config.emailSenderAddress,
            pass: config.emailSenderPassword,
        },
    })
    const mailOptions = {
        from: config.emailSenderAddress,
        to: receiverEmailAdrress,
        subject: emailSubject,
        html: htmlTemplate,
    }
    await transporter.sendMail(mailOptions)
}

export const resetPasswordOtpEmail = async (emailData) => {
    const templatePath = path.join(__dirname, '../views/resetPasswordEmail.ejs')
    const htmlTemplate = await ejs.renderFile(templatePath, {
        userName: emailData.userName,
        otp: emailData.otp,
    })
    await sendEmailNotification(
        emailData.receiverEmailAdrress,
        emailData.subject,
        htmlTemplate
    )
}

export const createProfileEmail = async (profileData) => {
    const templatePath = path.join(__dirname, '../views/createProfileEmail.ejs')
    const htmlTemplate = await ejs.renderFile(templatePath, {
        profile: profileData,
    })
    await sendEmailNotification(
        config.emailSenderAddress,
        "One profile Created",
        htmlTemplate
    )
}

export const registrationVerficationOtpEmail = async (emailData) => {
    const templatePath = path.join(__dirname, '../views/registrationVerficationEmail.ejs')
    const htmlTemplate = await ejs.renderFile(templatePath, {
        userName: emailData.userName,
        otp: emailData.otp,
    })
    await sendEmailNotification(
        emailData.receiverEmailAdrress,
        emailData.subject,
        htmlTemplate
    )
}

export const profileEmail = async (emailData) => {
    const templatePath = path.join(__dirname, '../views/profileEmail.ejs')
    const htmlTemplate = await ejs.renderFile(templatePath, {
        profiles: emailData.profiles,
    })
    await sendEmailNotification(
        emailData.receiverEmailAdrress,
        emailData.subject,
        htmlTemplate
    )
}
