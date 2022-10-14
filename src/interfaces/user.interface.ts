import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface UserInterface extends Model<InferAttributes<UserInterface>, InferCreationAttributes<UserInterface>> {
  id?: CreationOptional<number>;
  username: string;
  email: string;
  password: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
