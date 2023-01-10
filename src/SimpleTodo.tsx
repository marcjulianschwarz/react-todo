import React, { useEffect, useRef, useState } from "react";

interface Todo {
  title: string;
  completed: boolean;
  id: string;
}

interface TodoListItemProps {
  todo: Todo;
  onInit: (todo: Todo, el: HTMLInputElement) => void;
  onRemoveTodo: (todo: Todo, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onUpdateTodo: (todo: Todo, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onNavigationChange(direction: string): void;
}

function TodoListItem(props: TodoListItemProps) {
  const { todo, onInit, onRemoveTodo, onUpdateTodo, onNavigationChange } = props;

  const className = todo.completed ? "strike text-box" : "text-box";

  return (
    <li key={todo.id}>
      <input
        type="text"
        className={className}
        ref={(el: HTMLInputElement) => onInit(todo, el)}
        defaultValue={todo.title}
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key == "Backspace" && event.currentTarget.value == "") {
            onRemoveTodo(todo, event);
          }
          if (event.metaKey && event.key == "Enter") {
            todo.completed = !todo.completed;
            onUpdateTodo(todo, event);
          } else {
            if (event.key == "Enter" && !event.metaKey) {
              onUpdateTodo(todo, event);
            }
          }

          if (event.key == "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            onNavigationChange("up");
          }
          if (event.key == "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            onNavigationChange("down");
          }
        }}
      />
      <hr></hr>
    </li>
  );
}

export default function TodoList(props: { title: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Setting focus to new todo input
  const newTodoInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    newTodoInput.current?.focus();
  }, []);

  function focusOnNewTodoInput() {
    newTodoInput.current?.focus();
  }

  // Store refs to todo items
  const itemsRef = useRef<Map<string, HTMLElement>>();

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map<string, HTMLElement>();
    }
    return itemsRef.current;
  }

  function focusElement(todo: Todo) {
    const map = getMap();
    const el = map.get(todo.id);
    if (el) {
      el.focus();
    }
  }

  function addTodo(title: string) {
    const newTodo: Todo = {
      title: title,
      completed: false,
      id: crypto.randomUUID(),
    };
    setTodos([...todos, newTodo]);
  }

  function onRemoveTodo(todo: Todo, event: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    event.preventDefault();
    event.stopPropagation();
    if (idx == 0) {
      focusOnNewTodoInput();
    } else {
      focusElement(todos[idx - 1]);
    }

    const map = getMap();
    map.delete(todo.id);
    setTodos(todos.filter((t: Todo) => t.id != todo.id));
  }

  function onUpdateTodo(todo: Todo, event: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    event.preventDefault();
    event.stopPropagation();

    const newTodos = todos.map((t: Todo) => {
      if (t.id == todo.id) {
        return todo;
      } else {
        return t;
      }
    });
    setTodos(newTodos);

    if (idx == todos.length - 1) {
      focusOnNewTodoInput();
    } else {
      focusElement(todos[idx + 1]);
    }
  }

  function onInitTodo(todo: Todo, el: HTMLInputElement) {
    const map = getMap();
    if (!el) {
      map.delete(todo.id);
    } else {
      map.set(todo.id, el);
    }
  }

  const completedTodos = todos.filter((t: Todo) => t.completed);
  const allCompleted = completedTodos.length == todos.length && todos.length > 0;
  const titleClassName = allCompleted ? "all-completed todo-list-title" : "todo-list-title";

  return (
    <div className="todo-list">
      <span className={titleClassName}>
        {props.title} - {completedTodos.length} / {todos.length}
      </span>

      <ul>
        {todos.map((todo, idx) => {
          return (
            <TodoListItem
              todo={todo}
              onRemoveTodo={(todo: Todo, event: React.KeyboardEvent<HTMLInputElement>) =>
                onRemoveTodo(todo, event, idx)
              }
              onUpdateTodo={(todo: Todo, event: React.KeyboardEvent<HTMLInputElement>) =>
                onUpdateTodo(todo, event, idx)
              }
              onInit={onInitTodo}
              onNavigationChange={(direction: string) => {
                if (direction == "up") {
                  if (idx == 0) {
                    focusOnNewTodoInput();
                  } else {
                    focusElement(todos[idx - 1]);
                  }
                }
                if (direction == "down") {
                  if (idx == todos.length - 1) {
                    focusOnNewTodoInput();
                  } else {
                    focusElement(todos[idx + 1]);
                  }
                }
              }}
            ></TodoListItem>
          );
        })}
        <li>
          <input
            type="text"
            ref={newTodoInput}
            className="text-box"
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key == "Enter") {
                addTodo(event.currentTarget.value);
                event.currentTarget.value = "";
              }
              if (event.key == "Backspace" && event.currentTarget.value == "" && todos.length > 0) {
                event.preventDefault();
                event.stopPropagation();
                focusElement(todos[todos.length - 1]);
              }
              if (event.key == "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                if (todos.length > 0) {
                  focusElement(todos[todos.length - 1]);
                }
              }
            }}
          />
        </li>
      </ul>
    </div>
  );
}
