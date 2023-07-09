import {
  getAll,
  findById,
  update,
  insert,
  remove,
} from "../controllers/category.controller.js";
import { Router } from "express";

const categoryRoute = Router();

categoryRoute.get("/", getAll);

categoryRoute.get("/:pid", findById);

categoryRoute.post("/", insert);

categoryRoute.put("/:pid", update);

categoryRoute.delete("/:pid", remove);

export default categoryRoute;
