import TaskModel from '../../models/task.model';
import { TaskService } from '../../services/task.service';

const TaskResolver = {
  getTaskList: async () => {
    return await TaskService.getTaskList();
  },
  createTask: async (args) => {
    const task = TaskModel.build({
      title: args.newTask.title,
    });
    return await TaskService.createTask(args.newTask.listId, task.toJSON());
  },
  updateTaskById: async (args) => {
    const task = TaskModel.build({
      title: args.updateTask.title,
      status: args.updateTask.status,
    });
    return await TaskService.updateTaskById(args.id, task.toJSON());
  },
  deleteTaskById: async (args) => {
    return await TaskService.deleteTaskById(args.id);
  },
};

export default TaskResolver;
