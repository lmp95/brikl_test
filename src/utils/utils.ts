import { genSalt, hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const validatePassword = async (enteredPassword: string, password: string): Promise<boolean> => {
  return await compare(enteredPassword, password);
};

export const taskStatusList = ['To Do', 'In Progress', 'Completed'];
