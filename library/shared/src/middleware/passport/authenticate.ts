import passport from "./jwtStrategy.js";

export const authenticate = passport.authenticate("jwt", {
    session: false
});