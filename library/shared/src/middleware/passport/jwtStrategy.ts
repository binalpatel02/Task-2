import type { PassportStatic } from "passport";
import { Strategy as JwtStrategy, ExtractJwt, type VerifiedCallback } from "passport-jwt";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

export const initJwtStrategy = (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: JWT_SECRET,
            },
            (payload, done: VerifiedCallback) => {
                try {
                    return done(null, payload);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
};
