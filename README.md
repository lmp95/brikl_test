## Clone or download repo

In the root directory, you can run:

###### `npm install`

###### `npm run dev`

Open [http://localhost:3500/graphql](http://localhost:3500/graphql) to test graphql query.

After created new task or updated the task, it moved to the top of the task list of the status position.

##### Create new list

To get all lists and their tasks

      query{
          list{
            title
            tasks{
              id
              title
              status
            }
          }
        }


#### To create new list

        mutation{
          createList(newList: {title: "new list 1"}){
            id
            title
          }
        }

#### To create new task to the list

listId should be created list Id

        mutation{
          createTask(newTask: {title: "new task for list 1", listId: 1}){
            id
            title
          }
        }

#### To update task

id should be task Id and status must be one of these values ["To Do", "In Progress", "Completed"]

        mutation{
          updateTaskById(id: 1, updateTask: {title: "new updated task", status: "Completed"}){
            id
            title
            status
          }
        }

#### To delete task

id should be task Id

        mutation{
          deleteTaskById(id: 1){
            id
            title
            status
          }
        }
