import passport from "passport";
import {
  remove,
  getAll,
  getList,
  addCart,
  changeRole,
  removeInactive,
  uploadDocuments,
  uploadDocumentsPage,
  uploadedDocumentsPage,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../config/multer.js";
import { roleAdminValidation, roleUserValidation } from "../middlewares/index.js";

const userRoute = Router();

userRoute.put(
  "/addCart/:uid",
  passport.authenticate("current", { session: false }),
  roleUserValidation,
  addCart
);

userRoute.put(
  "/premium/:uid",
  passport.authenticate("current", { session: false }),
  changeRole
);

userRoute.post(
  "/:uid/documents",
  passport.authenticate("current", { session: false }),
  upload.fields([
    {
      name: "document",
    },
    {
      name: "profile",
      maxCount: 1,
    },
    {
      name: "product",
    },
  ]),
  uploadDocuments
);

userRoute.get(
  "/documents",
  passport.authenticate("current", { session: false }),
  uploadDocumentsPage
);

userRoute.get(
  "/:uid/uploadedDocuments",
  passport.authenticate("current", { session: false }),
  uploadedDocumentsPage
);

userRoute.get(
  "/",
  passport.authenticate("current", { session: false }),
  getAll
);

userRoute.get(
  "/list",
  passport.authenticate("current", { session: false }),
  roleAdminValidation,
  getList
);

userRoute.delete(
  "/",
  passport.authenticate("current", { session: false }),
  removeInactive
);

userRoute.delete(
  "/:uid",
  passport.authenticate("current", { session: false }),
  remove
);



export default userRoute;
