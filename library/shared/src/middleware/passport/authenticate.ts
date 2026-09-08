import { Request, Response, NextFunction } from "express";
import passport from "passport"; 
import { initJwtStrategy } from "./jwtStrategy.js";

initJwtStrategy(passport);

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("jwt", { session: false }, (err: any, user: any) => {

        if (err) return next(err);
        if (!user) return res.status(401).json({ error: "Unauthorized access token" });
        
        req.user = user;
        return next();
    })(req, res, next);
};
