import { EErrors } from "../../services/errors/enums.js";

const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case EErrors.INVALID_TYPE_ERROR:
      res.json({ status: "error", error: error.name });
      break;

    default:
      res.json({ status: "error", error: "Unhandled error" });
  }
};

export default errorHandler;
