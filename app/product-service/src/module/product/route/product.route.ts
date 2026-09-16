import { Router } from "express";
import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController } from "../controller/product.controller.js";
import {rateLimit, authenticate } from "@library/shared";

const router = Router();

const productRateLimit = rateLimit({
    windowSeconds: 120,
    maxRequests: 60,
    keyPrefix: "product-api"
})

router.use(authenticate, productRateLimit);

router.post("/", createProductController);

router.get("/", getProductsController);

router.get("/:product_id", getProductByIdController);

router.put("/:product_id", updateProductController);

router.delete("/:product_id", deleteProductController);

export default router;