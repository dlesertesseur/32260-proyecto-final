import config from "../config/config.js";

const roleAdminValidation = (req, res, next) => {
  if (req.user.role !== config.ADMIN_ROLE && req.user.role !== config.PREMIUM_ROLE) {
    res.status(401).send({message: "Unauthorized action for USER role"});
  } else {
    next();
  }
};

const roleUserValidation = (req, res, next) => {
    if (req.user.role !== config.USER_ROLE && req.user.role !== config.PREMIUM_ROLE) {
      res.status(401).send({message: "Unauthorized action for ADMIN role"});
    } else {
      next();
    }
  };

export { roleAdminValidation, roleUserValidation };
