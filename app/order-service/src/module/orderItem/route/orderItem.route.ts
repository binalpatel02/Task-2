import { Router } from "express";
import { createOrderItemController, getOrderItemsController, getOrderItemByIdController, updateOrderItemController, deleteOrderItemController } from "../controller/orderItem.controller.js";
import { rateLimit, authenticate } from "@library/shared";

const router = Router();

const orderItemRateLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 30,
    keyPrefix: "orderItem-api"
})

router.use(authenticate, orderItemRateLimit);

router.post("/", createOrderItemController);

router.get("/", getOrderItemsController);

router.get( "/:order_item_id", getOrderItemByIdController);

router.put( "/:order_item_id", updateOrderItemController);

router.delete( "/:order_item_id", deleteOrderItemController);

export default router;