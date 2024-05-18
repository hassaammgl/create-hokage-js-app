import express from "express";
import { validator } from "../validators/validator.js";
import { controller } from "../controllers/controller.js";

const router = express.Router();

router.post("/create", validator, controller);
// router.post("/create", controller);

export default router;