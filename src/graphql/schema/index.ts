import { buildSchema } from 'graphql';
import ListModel from '../../models/list.model';
import TaskModel from '../../models/task.model';
import { ListService } from '../../services/list.service';
import { TaskService } from '../../services/task.service';
import RootResolver from '../resolvers';

export const graphqlSchema = {
  schema: buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    status: String!
  }

  type NewList {
    id: ID!
    title: String!
  }

  type List {
    id: ID!
    title: String!
    tasks: [Task!]!
  }

  input TaskInput {
    listId: Int
    title: String!
  }

  input UpdateTaskInput {
    title: String!
    status: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input ListInput {
    title: String!
  }

  type RootQuery {
    users: [User!]!
    list: [List!]!
    getListById(id: Int!): List!
    getTaskList: [Task!]!
  }

  type RootMutation {
    createUser(user: UserInput): User
    createList(newList: ListInput): NewList
    createTask(newTask: TaskInput): Task
    updateTaskById(id: Int!, updateTask: UpdateTaskInput): Task
    deleteTaskById(id: Int!): Task
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
  `),
  rootValue: RootResolver,
  graphiql: true,
};

export default graphqlSchema;
