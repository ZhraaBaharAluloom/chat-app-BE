import { keys } from "../config/keys";
import User from "../entities/user";
import bcrypt from "bcrypt";

// Strategies
import JWTStrategy from "passport-jwt";
import LocalStrategy from "passport-local";
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

export const localStrategy = new LocalStrategy.Strategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username: any, password: any, done: any) => {
    try {
      const user = await User.findOne({ where: { username: username } as any });
      const comparedPassword = user
        ? await bcrypt.compare(password, user.password as any)
        : false;
      comparedPassword ? done(null, user) : done(null, false);
    } catch (error) {
      done(error);
    }
  }
);

export const jwtStrategy = new JWTStrategy.Strategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT_SECRET,
  },
  async (jwtPayload: any, done: any) => {
    if (jwtPayload) {
      const user = await User.findOneBy({ id: jwtPayload.id });
      return done(null, user);
    } else {
      return done(null, false);
    }
  }
);
