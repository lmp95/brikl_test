import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { TaskInterface } from './task.interface';

export interface ListInterface extends Model<InferAttributes<ListInterface>, InferCreationAttributes<ListInterface>> {
  id?: CreationOptional<number>;
  title: string;
  taskOrder: string;
  tasks?: TaskInterface[];
  createdAt?: Date;
  updatedAt?: Date;
}
