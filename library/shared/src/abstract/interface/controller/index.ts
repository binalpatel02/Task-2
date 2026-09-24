import type { Request, Response, NextFunction } from "express";

export interface IController {
    execute(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> | any;
}