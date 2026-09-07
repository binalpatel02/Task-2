import { Router } from "express";

import errorRouter from "../../module/error/route/error.route.js";

const router = Router();

router.use("/errors", errorRouter);

export default router;