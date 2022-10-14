import { config } from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import UserModel from '../models/user.model';

config();

const jwtVerify = async (payload, done) => {
  try {
    // const user = await UserModel.findOne({email: payload.email});
    // if (!user) {
    //     return done(null, false);
    // }
    return done(null, true);
  } catch (error) {
    return done(error, false);
  }
};

export const jwtStrategy = new Strategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  jwtVerify
);
