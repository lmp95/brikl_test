import UserModel from '../../models/user.model';
import { UserServices } from '../../services/user.service';

export const UserResolver = {
  users: () => {
    return UserServices.getUsers();
  },
  createUser: async (args) => {
    const user = UserModel.build({
      username: args.user.username,
      email: args.user.email,
      password: args.user.password,
    });
    return await UserServices.createUser(user);
  },
};
