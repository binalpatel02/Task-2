import type { Request, Response, NextFunction } from "express";
import type { IController } from "../interface/index.js";

export const controllerHandler = (controller: IController) =>
    ( req: Request, res: Response, next: NextFunction ) => {
        return controller.execute(
            req, res, next
        );
    };