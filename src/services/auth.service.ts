import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { LoginInterface } from '../interfaces/login.interface';
import { UserInterface } from '../interfaces/user.interface';
import ApiError from '../utils/apiError';
import { validatePassword } from '../utils/utils';
import { UserServices } from './user.service';

config();

/**
 * Generate token
 * @param {user} user
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (user: UserInterface, secret: string = process.env.JWT_SECRET): string => {
  const payload = {
    email: user.email,
    iat: moment().unix(),
    exp: moment().add(1, 'days').unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * User login
 * @param {LoginInterface} user
 */
const Login = async (user: LoginInterface) => {
  const isUser = await UserServices.getUserByEmail(user.email);
  if (isUser && (await validatePassword(user.password, isUser.password))) {
    const token = generateToken(isUser);
    return { email: isUser.email, token: token };
  } else throw new ApiError(400, 'Email or password is incorrect');
};

export const AuthService = {
  Login,
  generateToken,
};
