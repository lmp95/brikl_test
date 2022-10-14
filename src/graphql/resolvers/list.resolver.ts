import ListModel from '../../models/list.model';
import { ListService } from '../../services/list.service';

const ListResolver = {
  getListById: async (args) => {
    return await ListService.getListById(parseInt(args.id));
  },
  list: () => {
    return ListService.getList();
  },
  createList: async (args) => {
    const list = ListModel.build({
      title: args.newList.title,
    });
    return await ListService.createList(list.toJSON());
  },
};
export default ListResolver;
