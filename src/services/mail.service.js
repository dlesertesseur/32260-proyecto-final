import config from "../config/config.js";
import nodemailer from "nodemailer";
import { logger } from "../logger/index.js";

const gmailConfig = {
  service: config.EMAIL_APP_SERVICE,
  auth: {
    user: config.EMAIL_APP,
    pass: config.EMAIL_APP_PASSWORD,
  },
  tls : { rejectUnauthorized: false }
};

const sendMail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport(gmailConfig);

  const mailContent = {
    from: config.EMAIL_APP,
    to: to,
    subject: subject,
    html: body,
    attachments: [],
  };

  try {
    await transporter.sendMail(mailContent);
    logger.debug("sendMail to: " + to);
  } catch (error) {
    logger.error("sendMail -> error " + error);
  }
};

export default sendMail;
