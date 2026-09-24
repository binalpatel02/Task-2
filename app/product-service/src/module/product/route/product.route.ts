import { Router } from "express";
import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController } from "../controller/product.controller.js";
import {rateLimit, authenticate, controllerHandler } from "@library/shared";

const router = Router();

const productRateLimit = rateLimit({
    windowSeconds: 120,
    maxRequests: 60,
    keyPrefix: "product-api"
})

router.use(authenticate, productRateLimit);

router.post("/", controllerHandler(createProductController));

router.get("/", controllerHandler(getProductsController));

router.get("/:product_id",controllerHandler(getProductByIdController));

router.put("/:product_id", controllerHandler(updateProductController));

router.delete("/:product_id", controllerHandler(deleteProductController));

export default router;