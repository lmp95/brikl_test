import { DataTypes } from 'sequelize';
import { sequelize } from '../config/configs';
import { ListInterface } from '../interfaces/list.interface';
import TaskModel from './task.model';

const ListModel = sequelize.define<ListInterface>(
  'List',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskOrder: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
  }
);
ListModel.hasMany(TaskModel, {
  foreignKey: 'ListId',
  as: 'tasks',
});
TaskModel.belongsTo(ListModel);
export default ListModel;
