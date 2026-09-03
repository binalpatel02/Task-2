import { Router } from "express";
import { createUserController } from "../controller/user.controller.js";

const router = Router();

router.post("/", createUserController);

export default router;