import { Router } from "express";
import { createUserController, getUserByIdController, getUsersController, updateUserController, deleteUserController, loginUserController } from "../controller/user.controller.js";
import { rateLimit, controllerHandler } from "@library/shared";

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

router.post( "/login", loginRateLimit, controllerHandler(loginUserController));

router.use(userRateLimit);
router.post("/", controllerHandler(createUserController));
router.get("/", controllerHandler(getUsersController));
router.get("/:id", controllerHandler(getUserByIdController));
router.put("/:id", controllerHandler(updateUserController));
router.delete("/:id", controllerHandler(deleteUserController));

export default router;