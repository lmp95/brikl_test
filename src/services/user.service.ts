import httpStatus from 'http-status';
import { CreationOptional } from 'sequelize';
import { UserInterface } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
import ApiError from '../utils/apiError';
import { hashPassword } from '../utils/utils';

/**
 * Create user
 * @param {UserInterface} data
 * @returns {Promise<UserInterface>}
 */
const createUser = async (user: UserInterface): Promise<UserInterface> => {
  const existUser = await getUserByEmail(user.email);
  if (!existUser) {
    return await UserModel.create({
      username: user.username,
      email: user.email,
      password: await hashPassword(user.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else throw new ApiError(400, 'Email already exist');
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string): Promise<UserInterface> => {
  const user = await UserModel.findOne({ where: { email: email }, raw: true });
  return user;
};

/**
 * Get user list
 * @returns {UserInterface[]}
 */
const getUsers = async (): Promise<UserInterface[]> => {
  return await UserModel.findAll();
};

/**
 * Update user by user Id
 * @returns {UserInterface}
 */
const updateUserById = async (userId: CreationOptional<number>, user: UserInterface): Promise<UserInterface> => {
  const existUser = await UserModel.findByPk(userId);
  if (existUser) {
    let updatedUser;
    await UserModel.update(
      { ...user, password: await hashPassword(user.password) },
      {
        where: { id: existUser.id },
      }
    )
      .then(async () => {
        updatedUser = await UserModel.findByPk(existUser.id);
      })
      .catch(() => {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update user');
      });
    return updatedUser;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update user');
};

/**
 * Delete user by user Id
 * @returns {UserInterface}
 */
const deleteUserById = async (userId: CreationOptional<number>): Promise<UserInterface> => {
  const user = await UserModel.findByPk(userId);
  if (user) {
    await UserModel.destroy({
      where: { id: user.id },
    }).catch(() => {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to delete user');
    });
    return user;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to delete user');
};
export const UserServices = {
  createUser,
  getUserByEmail,
  getUsers,
  updateUserById,
  deleteUserById,
};
