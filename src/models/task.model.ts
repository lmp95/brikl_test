import { DataTypes } from 'sequelize';
import { sequelize } from '../config/configs';
import { TaskInterface } from '../interfaces/task.interface';
import { taskStatusList } from '../utils/utils';

const TaskModel = sequelize.define<TaskInterface>(
  'Task',
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: taskStatusList[0],
      validate: {
        isIn: [taskStatusList],
      },
    },
  },
  {
    timestamps: true,
  }
);
export default TaskModel;
