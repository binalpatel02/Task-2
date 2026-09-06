import { Router } from "express";

import orderRoutes
    from "../../module/order/route/order.route.js";

const router = Router();

router.use("/orders", orderRoutes);

export default router;