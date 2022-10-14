import { DataTypes } from 'sequelize';
import { sequelize } from '../config/configs';
import { UserInterface } from '../interfaces/user.interface';

const UserModel = sequelize.define<UserInterface>(
  'User',
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

export default UserModel;
