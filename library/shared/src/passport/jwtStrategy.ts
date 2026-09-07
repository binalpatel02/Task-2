import passport from "passport";

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key";

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET
        },

        async (payload, done) => {

            try {

                return done( null, payload );

            } catch (error) {

                return done( error, false );
            }
        }
    )
);

export default passport;