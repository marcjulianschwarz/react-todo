import { classNameBuilder, Todo } from "./utils";

interface TodoListItemProps {
  todo: Todo;
  onInit: (todo: Todo, el: HTMLInputElement) => void;
  onRemoveTodo: (todo: Todo) => void;
  onUpdateTodo: (todo: Todo, move: boolean) => void;
  onCompleted: (todo: Todo) => void;
}

export function TodoListItem(props: TodoListItemProps) {
  const { todo, onInit, onRemoveTodo, onUpdateTodo, onCompleted } = props;

  const className = classNameBuilder("text-box", { condition: todo.completed, className: "strike" });

  return (
    <li key={todo.id}>
      <input
        type="text"
        className={className}
        ref={(el: HTMLInputElement) => onInit(todo, el)}
        defaultValue={todo.title + (todo.completed ? " (completed)" : "")}
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key == "Backspace" && event.currentTarget.value == "") {
            event.preventDefault();
            event.stopPropagation();
            onRemoveTodo(todo);
          }
          if (event.metaKey && event.key == "Enter") {
            todo.completed = !todo.completed;
            onCompleted(todo);
          }
          if (event.key == "Enter" && !event.metaKey) {
            todo.title = event.currentTarget.value;
            onUpdateTodo(todo, true);
          }
        }}
      />
      <hr></hr>
    </li>
  );
}
