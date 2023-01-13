import { classNameBuilder, NavigationDirection, Todo } from "./utils";

interface TodoListItemProps {
  todo: Todo;
  onInit: (todo: Todo, el: HTMLInputElement) => void;
  onRemoveTodo: (todo: Todo) => void;
  onUpdateTodo: (todo: Todo, move: boolean) => void;
  onCompleted: (todo: Todo) => void;
  onNavigation: (direction: NavigationDirection) => void;
}

export function TodoListItem(props: TodoListItemProps) {
  const { todo, onInit, onRemoveTodo, onUpdateTodo, onCompleted } = props;

  const className = classNameBuilder("text-box", { condition: todo.completed, className: "strike" });

  return (
    <li key={todo.id}>
      <input
        type="text"
        className={className}
        spellCheck={false}
        ref={(el: HTMLInputElement) => onInit(todo, el)}
        defaultValue={todo.title}
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
          if (event.key == "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            props.onNavigation(NavigationDirection.Up);
          }
          if (event.key == "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            props.onNavigation(NavigationDirection.Down);
          }
        }}
        onMouseDownCapture={(event: React.MouseEvent<HTMLInputElement>) => {
          event.preventDefault();
          event.stopPropagation();
          props.onNavigation(NavigationDirection.MouseClick);
        }}
      />
    </li>
  );
}
