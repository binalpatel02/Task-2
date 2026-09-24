import { Router } from "express";
import { createOrderController, getOrdersController, getOrderByIdController, updateOrderController, deleteOrderController } from "../controller/order.controller.js";
import {rateLimit, authenticate, controllerHandler } from "@library/shared";

const router = Router();

const orderRateLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 30,
    keyPrefix: "order-api"
})

router.use(authenticate, orderRateLimit);

router.post("/", controllerHandler(createOrderController));

router.get("/", controllerHandler(getOrdersController));

router.get("/:order_id", controllerHandler(getOrderByIdController));

router.put("/:order_id", controllerHandler(updateOrderController));

router.delete("/:order_id", controllerHandler(deleteOrderController));

export default router;