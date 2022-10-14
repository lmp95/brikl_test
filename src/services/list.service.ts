import httpStatus from 'http-status';
import { CreationOptional } from 'sequelize';
import { ListInterface } from '../interfaces/list.interface';
import { TaskInterface } from '../interfaces/task.interface';
import ListModel from '../models/list.model';
import TaskModel from '../models/task.model';
import ApiError from '../utils/apiError';
import { TaskService } from './task.service';

/**
 * Create list
 * @param {ListInterface} list
 * @returns {Promise<ListInterface>}
 */
const createList = async (list: ListInterface): Promise<ListInterface> => {
  return await ListModel.create({
    ...list,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

/**
 * Get list
 * @returns {ListInterface[]}
 */
const getList = async (): Promise<ListInterface[]> => {
  const result = await ListModel.findAll({
    include: [
      {
        model: TaskModel,
        as: 'tasks',
      },
    ],
  });
  const newList = [];
  result.forEach((list) => {
    let newTaskList = [];
    const orders = list.taskOrder.split('|');
    orders.forEach((order) => {
      order.split(',').forEach((id) => {
        const task = list.tasks.find((task) => task.id === parseInt(id));
        if (task) newTaskList.push(task);
      });
    });
    newList.push({ ...list.toJSON(), tasks: newTaskList });
  });
  return newList;
};

/**
 * Get list by Id
 * @returns {Promise<any>}
 */
const getListById = async (listId: number): Promise<any> => {
  const list = await ListModel.findByPk(listId);
  if (list) {
    const tasks: TaskInterface[] = await TaskService.getTaskListByListId(list.id);
    // sort tasks by list order
    let newTaskList = [];
    list.taskOrder.split('|').forEach((statusList) => {
      statusList.split(',').forEach((id) => {
        const task = tasks.find((task) => task.id === parseInt(id));
        if (task) newTaskList.push(task);
      });
    });
    const result = {
      ...list.toJSON(),
      tasks: newTaskList,
    };
    return result;
  } else throw new ApiError(httpStatus.NOT_FOUND, 'List not found');
};

/**
 * Update list by list Id
 * @returns {ListInterface}
 */
const updateListById = async (listId: number, list: ListInterface): Promise<ListInterface> => {
  const existList = await ListModel.findByPk(listId);
  if (existList) {
    let updatedList: ListInterface;
    await ListModel.update(
      { ...list },
      {
        where: { id: existList.id },
      }
    )
      .then(async () => {
        updatedList = await ListModel.findByPk(existList.id);
      })
      .catch(() => {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update list');
      });
    return updatedList;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update list');
};

/**
 * Delete list by list Id
 * @returns {ListInterface}
 */
const deleteListById = async (listId: CreationOptional<number>): Promise<ListInterface> => {
  const list = await ListModel.findByPk(listId);
  if (list) {
    await ListModel.destroy({
      where: { id: list.id },
    }).catch(() => {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to delete list');
    });
    return list;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to delete list');
};

/**
 * Update list tasks order by Id
 * @returns {ListInterface}
 */
const updateListTasksOrderById = async (listId: number, order: string): Promise<ListInterface> => {
  let updatedList;
  await ListModel.update(
    { taskOrder: order },
    {
      where: { id: listId },
    }
  )
    .then(async () => {
      updatedList = await ListModel.findByPk(listId);
    })
    .catch(() => {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to update list');
    });
  return updatedList;
};

export const ListService = {
  createList,
  getListById,
  getList,
  updateListById,
  deleteListById,
  updateListTasksOrderById,
};
