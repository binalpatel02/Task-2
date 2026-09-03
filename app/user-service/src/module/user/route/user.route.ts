import { Router } from "express";
import { createUserController, getUserByIdController, getUsersController, updateUserController, deleteUserController } from "../controller/user.controller.js";

const router = Router();

router.post("/", createUserController);
router.get("/", getUsersController);
router.get("/:id", getUserByIdController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;