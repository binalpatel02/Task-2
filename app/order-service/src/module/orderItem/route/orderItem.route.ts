import { Router } from "express";

import { createOrderItemController, getOrderItemsController, getOrderItemByIdController, updateOrderItemController, deleteOrderItemController } from "../controller/orderItem.controller.js";

import { authenticate } from "@library/shared";

const router = Router();

router.use(authenticate);

router.post("/", createOrderItemController);

router.get("/", getOrderItemsController);

router.get( "/:order_item_id", getOrderItemByIdController);

router.put( "/:order_item_id", updateOrderItemController);

router.delete( "/:order_item_id", deleteOrderItemController);

export default router;