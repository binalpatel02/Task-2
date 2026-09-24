import { Router } from "express";
import { createOrderItemController, getOrderItemsController, getOrderItemByIdController, updateOrderItemController, deleteOrderItemController } from "../controller/orderItem.controller.js";
import { rateLimit, authenticate, controllerHandler } from "@library/shared";

const router = Router();

const orderItemRateLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 30,
    keyPrefix: "orderItem-api"
})

router.use(authenticate, orderItemRateLimit);

router.post("/", controllerHandler(createOrderItemController));

router.get("/", controllerHandler(getOrderItemsController));

router.get( "/:order_item_id", controllerHandler(getOrderItemByIdController));

router.put( "/:order_item_id", controllerHandler(updateOrderItemController));

router.delete( "/:order_item_id", controllerHandler(deleteOrderItemController));

export default router;