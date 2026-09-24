import { Router } from "express";

import { createErrorController, getErrorsController, getErrorByIdController, updateErrorController, deleteErrorController } from "../controller/error.controller.js";

import { authenticate, controllerHandler } from "@library/shared";

const router = Router();

router.use(authenticate);

router.post( "/", controllerHandler(createErrorController));

router.get( "/", controllerHandler(getErrorsController));

router.get( "/:error_id", controllerHandler(getErrorByIdController));

router.put( "/:error_id", controllerHandler(updateErrorController));

router.delete( "/:error_id", controllerHandler(deleteErrorController));

export default router;