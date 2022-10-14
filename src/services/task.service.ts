import httpStatus from 'http-status';
import { ListInterface } from '../interfaces/list.interface';
import { TaskInterface } from '../interfaces/task.interface';
import TaskModel from '../models/task.model';
import ApiError from '../utils/apiError';
import { taskStatusList } from '../utils/utils';
import { ListService } from './list.service';

/**
 * Create new task
 * @param {TaskInterface} newTask
 * @returns {Promise<TaskInterface>}
 */
const createTask = async (listId: number, newTask: TaskInterface): Promise<TaskInterface> => {
  const list = await ListService.getListById(listId);
  if (list) {
    const createdTask = await TaskModel.create({
      ...newTask,
      ListId: list.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // prepend new task to list
    const groupedList = list.taskOrder.split('|');
    const listOrders = updateTaskOrders(groupedList, newTask, createdTask);
    // update task orders to list by id
    await ListService.updateListTasksOrderById(list.id, listOrders.join('|'));
    return createdTask;
  } else throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to create task');
};

/**
 * Get list of task
 * @returns {TaskInterface[]}
 */
const getTaskList = async (): Promise<TaskInterface[]> => {
  return await TaskModel.findAll({ raw: true });
};

/**
 * Get list of task by list id
 * @returns {TaskInterface[]}
 */
const getTaskListByListId = async (listId: number): Promise<TaskInterface[]> => {
  return await TaskModel.findAll({ where: { ListId: listId }, raw: true });
};

/**
 * Update task by task Id
 * @returns {TaskInterface}
 */
const updateTaskById = async (taskId: number, task: TaskInterface): Promise<TaskInterface> => {
  const existTask = await TaskModel.findOne({ where: { id: taskId }, raw: true });
  if (existTask) {
    let updatedTask: TaskInterface;

    const list = await ListService.getListById(existTask.ListId);
    await TaskModel.update(
      { ...existTask, title: task.title, status: task.status },
      {
        where: { id: existTask.id },
      }
    )
      .then(async () => {
        // remove order to new task order
        const lists = removeTaskOrderFromList(list, existTask);

        // add to new status task order list
        const listOrders = updateTaskOrders(lists, task, existTask);

        // update task orders to list by id
        await ListService.updateListTasksOrderById(list.id, listOrders.join('|'));

        // return createdTask;
        updatedTask = await TaskModel.findByPk(existTask.id);
      })
      .catch((error) => {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update task');
      });
    return updatedTask;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update task');
};

/**
 * Delete task by task Id
 * @returns {TaskInterface}
 */
const deleteTaskById = async (taskId: number): Promise<TaskInterface> => {
  const task = await TaskModel.findOne({ where: { id: taskId } });
  if (task) {
    await TaskModel.destroy({
      where: { id: task.id, ListId: task.ListId },
    }).catch(() => {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to delete task');
    });

    const list = await ListService.getListById(task.ListId);

    const listOrder = removeTaskOrderFromList(list, task);

    // update list task orders
    await ListService.updateListTasksOrderById(list.id, listOrder.join('|'));
    return task;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to delete task');
};

// remove task from list task order
const removeTaskOrderFromList = (list: ListInterface, task: TaskInterface): string[] => {
  const grpLists = list.taskOrder.split('|');
  // const oldIndex = grpLists[taskStatusList.indexOf(task.status)].indexOf(task.id.toString());
  const oldOrders = grpLists[taskStatusList.indexOf(task.status)].split(',');
  oldOrders.splice(oldOrders.indexOf(task.id.toString()), 1);
  const removed = oldOrders.join(',');
  grpLists.splice(taskStatusList.indexOf(task.status), 1, removed);
  return grpLists;
};

// update task oders in list
const updateTaskOrders = (lists, newTask, updateTask) => {
  const targetList = lists.splice(taskStatusList.indexOf(newTask.status), 1)[0];
  let taskOrders: any;
  if (targetList) {
    taskOrders = targetList.split(',');
    taskOrders.unshift(updateTask.id);
  } else {
    taskOrders = updateTask.id;
  }
  lists.splice(taskStatusList.indexOf(newTask.status), 0, taskOrders);
  return lists;
};

export const TaskService = {
  createTask,
  getTaskList,
  getTaskListByListId,
  updateTaskById,
  deleteTaskById,
};
