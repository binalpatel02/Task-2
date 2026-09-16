import { Router } from "express";
import { createOrderController, getOrdersController, getOrderByIdController, updateOrderController, deleteOrderController } from "../controller/order.controller.js";
import {rateLimit, authenticate } from "@library/shared";

const router = Router();

const orderRateLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 30,
    keyPrefix: "order-api"
})

router.use(authenticate, orderRateLimit);

router.post("/", createOrderController);

router.get("/", getOrdersController);

router.get("/:order_id", getOrderByIdController);

router.put("/:order_id", updateOrderController);

router.delete("/:order_id", deleteOrderController);

export default router;