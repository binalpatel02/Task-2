import { Router } from "express";

import orderRoutes from "../../module/order/route/order.route.js";
import orderItemRoutes from "../../module/orderItem/route/orderItem.route.js"

const router = Router();

router.use("/orders", orderRoutes);
router.use("/orderItems", orderItemRoutes);

export default router;