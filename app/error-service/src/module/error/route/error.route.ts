import { Router } from "express";

import { createErrorController, getErrorsController, getErrorByIdController, updateErrorByIdController, deleteErrorController } from "../controller/error.controller.js";

const router = Router();

router.post( "/", createErrorController );

router.get( "/", getErrorsController );

router.get( "/:error_id", getErrorByIdController );

router.put( "/:error_id", updateErrorByIdController);

router.delete( "/:error_id", deleteErrorController);

export default router;