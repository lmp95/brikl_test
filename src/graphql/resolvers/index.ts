import ListResolver from './list.resolver';
import TaskResolver from './task.resolver';
import { UserResolver } from './user.resolver';

const RootResolver = {
  ...UserResolver,
  ...ListResolver,
  ...TaskResolver,
};

export default RootResolver;
