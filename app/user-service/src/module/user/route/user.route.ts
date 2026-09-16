import { Router } from "express";
import { createUserController, getUserByIdController, getUsersController, updateUserController, deleteUserController, loginUserController } from "../controller/user.controller.js";
import { rateLimit } from "@library/shared";

const router = Router();

const loginRateLimit = rateLimit({
    windowSeconds: 300,
    maxRequests: 5,
    keyPrefix: "user-login",
});

const userRateLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 20,
    keyPrefix: "user-api"
})

router.post( "/login", loginRateLimit, loginUserController );

router.use(userRateLimit);
router.post("/", createUserController);
router.get("/", getUsersController);
router.get("/:id", getUserByIdController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;