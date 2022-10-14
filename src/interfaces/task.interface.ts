import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface TaskInterface extends Model<InferAttributes<TaskInterface>, InferCreationAttributes<TaskInterface>> {
  id?: number;
  title: string;
  status: string;
  ListId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
