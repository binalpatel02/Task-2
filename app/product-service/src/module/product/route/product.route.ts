import { Router } from "express";

import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController } from "../controller/product.controller.js";

import { authenticate } from "@library/shared";

const router = Router();

router.use(authenticate);

router.post("/", createProductController);

router.get("/", getProductsController);

router.get("/:product_id", getProductByIdController);

router.put("/:product_id", updateProductController);

router.delete("/:product_id", deleteProductController);

export default router;