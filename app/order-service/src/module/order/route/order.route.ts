import { Router } from "express";

import { createOrderController, getOrdersController, getOrderByIdController, updateOrderController, deleteOrderController } from "../controller/order.controller.js";

import { authenticate } from "@library/shared";

const router = Router();

router.use(authenticate);

router.post("/", createOrderController);

router.get("/", getOrdersController);

router.get("/:order_id", getOrderByIdController);

router.put("/:order_id", updateOrderController);

router.delete("/:order_id", deleteOrderController);

export default router;