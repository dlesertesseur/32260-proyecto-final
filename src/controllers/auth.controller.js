import config from "../config/config.js";
import {
  authenticate,
  newPasswordFromEmail,
  registerLasConnection,
  registerUser,
  resetPasswordFromEmail,
} from "../services/auth.service.js";
import { createHash } from "../util/Crypt.js";
import { getRoleByUser } from "../util/Validator.js";
import { generateAuthToken } from "../util/jwt.js";

const login = async (req, res) => {
  try {
    const user = await authenticate(req.body);
    req.session.email = user.email;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;
    req.session.age = user.age;

    /*Validacion de rol*/
    req.session.role = getRoleByUser(req.body);

    res.redirect("../../api/products/list");
  } catch (error) {
    res.render("login-error", { error });
  }
};

const loginPassport = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAuthToken(user);

    const page = user.role === config.ADMIN_ROLE ? "../../api/users/list" : "../../api/products/list";
    
    res
      .cookie("authToken", accessToken, { httpOnly: true })
      .redirect(page);
  } catch (error) {
    throw error;
  }
};

const register = async (req, res) => {
  try {
    const newUser = { ...req.body };

    /*VALIDA EL SUPER USUARIO*/
    newUser.role = getRoleByUser(newUser);
    newUser.password = createHash(newUser.password);

    await registerUser(newUser);
    res.redirect("/api/auth/login");
  } catch (error) {
    res.render("register-error", { error });
  }
};

const registerPassport = async (req, res) => {
  try {
    res.redirect("/api/auth/login");
  } catch (error) {
    res.render("register-error", { error });
  }
};

const loginPage = async (req, res) => {
  try {
    res.render("login", {
      title: "Login",
      style: "index.css",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const registerPage = async (req, res) => {
  try {
    res.render("register", {
      title: "Register",
      style: "index.css",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const logout = (req, res) => {
  // req.session.destroy((error) => {
  //   res.redirect("/api/auth/login");
  // });
  registerLasConnection(req.user.id)
  res.clearCookie("authToken");
  res.redirect("/api/auth/login");
};

const resetPasswordPage = async (req, res) => {
  try {
    res.render("resetPassword", {
      title: "Reset Password",
      style: "index.css",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const newPasswordPage = async (req, res) => {
  try {
    const params = { email: req.query.email, code: req.query.code };
    res.render("newPassword", {
      title: "New Password",
      style: "index.css",
      params,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  let data = null;
  try {
    await resetPasswordFromEmail(req.get('host'), req.body.email);
    data = {
      title: "Reset Password",
      message: `Check your email box (${req.body.email}), please.`,
    };
  } catch (error) {
    data = { title: "Reset Password ERROR", message: error.message };
  }
  res.render("resetPassword-message", { data });
};

const newPassword = async (req, res) => {
  let data = null;
  try {
    const email = req.body.email;
    const code = req.body.code;
    const newPass = req.body.password;

    await newPasswordFromEmail(email, code, newPass);
    data = {
      title: "Reset Password",
      message: `Your password has been changed successfully`,
    };
  } catch (error) {
    data = { title: "Reset Password ERROR", message: error.message };
  }
  res.render("resetPassword-message", { data });
};

export {
  register,
  login,
  registerPage,
  loginPage,
  logout,
  loginPassport,
  registerPassport,
  resetPasswordPage,
  resetPassword,
  newPasswordPage,
  newPassword
};
