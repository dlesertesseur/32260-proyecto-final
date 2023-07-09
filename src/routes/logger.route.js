import { Router } from "express";
import passport from "passport";

const loggerRoute = Router();

const text = (level) => {
  const text = `Logger test ${level.toUpperCase()} level`;
  return text;
};
const loggerTest = (req, res) => {
  req.logger.fatal(text("fatal"));
  req.logger.error(text("error"));
  req.logger.warning(text("warning"));
  req.logger.info(text("info"));
  req.logger.http(text("http"));
  req.logger.debug(text("debug"));

  res.send("logger test");
};

loggerRoute.get(
  "/",
  passport.authenticate("current", { session: false }),
  loggerTest
);

export default loggerRoute;
