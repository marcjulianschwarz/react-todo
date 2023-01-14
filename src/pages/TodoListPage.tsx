import TodoListComponent from "../components/Todo/TodoList";
import { TodoList } from "../utils";

export function TodoListPage(props: {
  todoLists: TodoList[];
  onTodoListCreate: (title: string) => void;
  onTodoListDelete: (list: TodoList) => void;
  triggerHUD: (title: string | undefined, message: string) => void;
}) {
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
            props.triggerHUD("New List ✅", "");
          }
        }}
      >
        {props.todoLists.map((todoList: TodoList) => {
          return (
            <TodoListComponent
              todoList={todoList}
              key={todoList.id}
              triggerHUD={props.triggerHUD}
              handleListDelete={(list: TodoList) => props.onTodoListDelete(list)}
            />
          );
        })}
      </div>
    </>
  );
}
