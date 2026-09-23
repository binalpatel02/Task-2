export interface IController {
    execute(
        req: Request,
        res: Response
    ): Promise<Response>;
}