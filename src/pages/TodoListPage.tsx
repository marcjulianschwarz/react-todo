import { useContext } from "react";
import TodoListComponent from "../components/Todo/TodoList";
import { TodoList } from "../utils";
import { EventContext } from "../utils/events";

export function TodoListPage(props: {
  todoLists: TodoList[];
  onTodoListCreate: (title: string) => void;
  onTodoListDelete: (list: TodoList) => void;
}) {
  const [onAppEvent, emitAppEvent] = useContext(EventContext);

  return (
    <>
      <div
        className="todo-lists-container"
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.metaKey && event.shiftKey && event.key == "p") {
            event.preventDefault();
            event.stopPropagation();
            const title = prompt("New Todo List Title") || "No Name";
            props.onTodoListCreate(title);
            emitAppEvent({
              name: "showHUD",
              payload: {
                title: "New Todo List",
                message: `Todo list "${title}" created`,
              },
            });
          }
        }}
      >
        {props.todoLists.map((todoList: TodoList) => {
          return (
            <TodoListComponent
              todoList={todoList}
              key={todoList.id}
              handleListDelete={(list: TodoList) => props.onTodoListDelete(list)}
            />
          );
        })}
      </div>
    </>
  );
}
