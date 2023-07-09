import UserRepository from "../repositories/user.repository.js";
import sendMail from "./mail.service.js";
import cron from "node-cron";
import config from "../config/config.js";
import { nanoid } from "nanoid/non-secure";

const codeByEmail = new Map();
const repository = new UserRepository();

const expiredCode = (d1, d2, minutes) => {
  const diffTime = Math.abs(d2 - d1);
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  return diffMinutes > minutes;
};

cron.schedule("* * * * *", () => {
  const toDelete = [];
  const actual = Date.now();

  //console.log("cron.schedule ->", codeByEmail);

  codeByEmail.forEach((value, key) => {
    if (expiredCode(value.timestamp, actual, config.MAX_MINUTES_TO_EXPIRE)) {
      toDelete.push(key);
    }
  });

  toDelete.forEach((key) => {
    codeByEmail.delete(key);
  });
});

const authenticate = async (body) => {
  const user = await repository.authenticate(body.email, body.password);

  repository.update(user.id, { last_connection: Date.now() });

  return user;
};

const registerUser = async (body) => {
  const ret = await repository.register(body);
  return ret;
};

const resetPasswordFromEmail = async (host, email) => {
  const user = await repository.findByEmail(email);
  if (user) {
    const code = nanoid();
    const url = `http://${host}/api/auth/newpassword?email=${user.email}&code=${code}`;
    const subject = `RESET PASSWORD`;
    const link = `<p><a href="${url}">Reset password</a></p>`;
    const body = `<h3>Hi ${user.firstName}, You recently requested to reset the password for your account.<br/><br/>Click the link below to proceed.<br/><br/>If you did not request a password reset, please ignore this email or reply to let us know.</h3><br/>${link}`;

    codeByEmail.set(user.email, {
      email: user.email,
      code: code,
      timestamp: new Date(),
    });

    await sendMail(email, subject, body);
  } else {
    throw new Error(`email ${email} not found`);
  }
};

const validateCode = (email, code) => {
  let ret = false;
  const storageCode = codeByEmail.get(email);

  if (storageCode && storageCode.code === code) {
    ret = true;
  }

  return ret;
};

const newPasswordFromEmail = async (email, code, newPass) => {
  const user = await repository.findByEmail(email);
  if (user) {
    if (validateCode(email, code)) {
      await repository.resetPassword(email, newPass);
    } else {
      throw new Error(`Code is not valid or expired`);
    }
  } else {
    throw new Error(`email ${email} not found`);
  }
};

const registerLasConnection = async (uid) => {
  repository.update(uid, { last_connection: Date.now() });
};

export {
  authenticate,
  registerUser,
  resetPasswordFromEmail,
  newPasswordFromEmail,
  registerLasConnection
};
