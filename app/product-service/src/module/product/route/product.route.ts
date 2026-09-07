import { Router } from "express";

import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController } from "../controller/product.controller.js";

const router = Router();

router.post("/", createProductController);

router.get("/", getProductsController);

router.get("/:product_id", getProductByIdController);

router.put("/:product_id", updateProductController);

router.delete("/:product_id", deleteProductController);

export default router;