import React, { useEffect, useReducer, useRef, useState } from "react";
import { useFocus } from "./hooks";
import { todoReducer } from "./todoReducer";
import { classNameBuilder, Todo, UserAction } from "./utils";
import { TodoListItem } from "./TodoListItem";

export default function TodoList(props: { title: string }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [focusElement, getMap] = useFocus();
  const [showCompleted, setShowCompleted] = useState<Todo>();

  // Show completed "modal" for two seconds
  useEffect(() => {
    if (showCompleted) {
      setInterval(() => {
        setShowCompleted(undefined);
      }, 2000);
    }
  }, [showCompleted]);

  // Setting focus to new todo input
  const newTodoInput = useRef<HTMLInputElement>(null);

  function handleDeleteTodo(todo: Todo, moveTo: number) {
    dispatch({
      type: UserAction.Delete,
      payload: { todo: todo },
    });
    if (moveTo < 0) {
      newTodoInput.current?.focus();
    }
    focusElement(todos[moveTo]);
  }

  function handleAddTodo(title: string) {
    dispatch({
      type: UserAction.Add,
      payload: { title: title },
    });
  }

  function handleUpdateTodo(todo: Todo, moveTo: number) {
    dispatch({
      type: UserAction.Update,
      payload: { todo: todo },
    });
    console.log(moveTo);
    if (moveTo < 0) {
      moveTo = 0;
    } else if (moveTo >= todos.length) {
      newTodoInput.current?.focus();
    } else {
      focusElement(todos[moveTo]);
    }
  }

  function handleCompleted(todo: Todo) {
    dispatch({
      type: UserAction.Completed,
      payload: { todo: todo },
    });
    if (todo.completed) {
      setShowCompleted(todo);
    }
  }

  function addRefToMap(todo: Todo, el: HTMLInputElement) {
    const map = getMap();
    if (!el) {
      map.delete(todo.id);
    } else {
      map.set(todo.id, el);
    }
  }

  const completedTodos = todos.filter((t: Todo) => t.completed);
  const allCompleted = completedTodos.length == todos.length && todos.length > 0;
  const titleClassName = classNameBuilder("todo-list-title", { condition: allCompleted, className: "all-completed" });

  return (
    <div className="todo-list">
      <span className={titleClassName}>
        {props.title} - {completedTodos.length} / {todos.length}
      </span>

      <ul>
        {todos.map((todo, idx) => {
          return (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onRemoveTodo={(todo: Todo) => handleDeleteTodo(todo, idx - 1)}
              onUpdateTodo={(todo: Todo) => handleUpdateTodo(todo, idx + 1)}
              onCompleted={handleCompleted}
              onInit={addRefToMap}
            />
          );
        })}
        <li>
          <input
            type="text"
            ref={newTodoInput}
            className="text-box"
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key == "Enter") {
                handleAddTodo(event.currentTarget.value);
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
      {showCompleted && <span>Completed {showCompleted.title} 🎉</span>}
    </div>
  );
}
