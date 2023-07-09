import config from "../config/config.js";

function isAdministrator(user) {
  if (
    user.email === config.ADMIN_EMAIL &&
    user.password === config.ADMIN_PASSWORD
  ) {
    return true;
  } else {
    return false;
  }
}

function getRoleByUser(user) {
  let role = null;

  try {
    if (
      user.email === config.ADMIN_EMAIL &&
      user.password === config.ADMIN_PASSWORD
    ) {
      role = config.ADMIN_ROLE;
    } else {
      role = config.USER_ROLE;
    }
  } catch (error) {
    console.log(error);
    role = config.USER_ROLE;
  }

  return role;
}

export { getRoleByUser, isAdministrator };
