import nodemailer from "nodemailer";
import { SETTINGS } from "../../settings/config";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS 
    }
});

export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
        template: (code:string) => string
    ): Promise<boolean> {
        try {
            let info = await transporter.sendMail({
                from: `"My API" <Nilsuspor@gmail.com>`, 
                to: email,
                subject: 'Your code is here',
                html: template(code),
            });
            return !!info;
        } catch (error) {
            console.error("Ошибка при отправке письма: ", error);
            return false;
        }
    }
}